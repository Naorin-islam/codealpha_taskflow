import { NextResponse } from 'next/server';
import { PrismaClient, TaskStatus, Priority } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, description, projectId, assigneeId, priority, dueDate, status } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: 'Title and projectId are required' }, { status: 400 });
    }

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: user.id } }
    });

    if (!membership || membership.role === 'VIEWER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const lastTask = await prisma.task.findFirst({
      where: { projectId, status: status || TaskStatus.TODO },
      orderBy: { position: 'desc' }
    });

    const newPosition = lastTask ? lastTask.position + 1024 : 1024;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        createdById: user.id,
        assigneeId: assigneeId || null,
        priority: priority || Priority.MEDIUM,
        status: status || TaskStatus.TODO,
        position: newPosition,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        labels: { include: { label: true } }
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
