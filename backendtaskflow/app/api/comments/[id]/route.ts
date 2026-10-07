import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const commentId = params.id;
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (comment.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. Only author can edit.' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: body.content },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const commentId = params.id;
    const comment = await prisma.comment.findUnique({ 
      where: { id: commentId },
      include: { task: true }
    });
    if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: comment.task.projectId, userId: user.id } }
    });

    if (comment.userId !== user.id && (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
