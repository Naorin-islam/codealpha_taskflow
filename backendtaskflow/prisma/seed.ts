import { PrismaClient, Role, ProjectStatus, MemberRole, Priority, TaskStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  console.log('Creating users...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      email: 'admin@taskflow.com',
      name: 'Admin User',
      username: 'admin',
      passwordHash,
      role: Role.ADMIN,
    },
  })

  const naorin = await prisma.user.upsert({
    where: { email: 'naorin@taskflow.com' },
    update: {},
    create: {
      email: 'naorin@taskflow.com',
      name: 'Naorin Islam',
      username: 'naorin',
      passwordHash,
      role: Role.USER,
    },
  })

  const rahim = await prisma.user.upsert({
    where: { email: 'rahim@taskflow.com' },
    update: {},
    create: {
      email: 'rahim@taskflow.com',
      name: 'Rahim Khan',
      username: 'rahim',
      passwordHash,
      role: Role.USER,
    },
  })

  const mila = await prisma.user.upsert({
    where: { email: 'mila@taskflow.com' },
    update: {},
    create: {
      email: 'mila@taskflow.com',
      name: 'Mila Santos',
      username: 'mila',
      passwordHash,
      role: Role.USER,
    },
  })

  console.log('Creating projects...')
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesigning the corporate website',
      ownerId: admin.id,
      status: ProjectStatus.ACTIVE,
      members: {
        create: [
          { userId: admin.id, role: MemberRole.OWNER },
          { userId: naorin.id, role: MemberRole.ADMIN },
          { userId: rahim.id, role: MemberRole.MEMBER },
        ]
      }
    }
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile Application',
      description: 'New cross-platform mobile app',
      ownerId: naorin.id,
      status: ProjectStatus.PLANNING,
      members: {
        create: [
          { userId: naorin.id, role: MemberRole.OWNER },
          { userId: mila.id, role: MemberRole.MEMBER },
        ]
      }
    }
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Building an online store',
      ownerId: rahim.id,
      status: ProjectStatus.ACTIVE,
      members: {
        create: [
          { userId: rahim.id, role: MemberRole.OWNER },
          { userId: admin.id, role: MemberRole.ADMIN },
        ]
      }
    }
  })

  console.log('Creating tasks...')
  await prisma.task.create({
    data: {
      title: 'Design Homepage',
      description: 'Create Figma designs for the new homepage',
      projectId: project1.id,
      createdById: admin.id,
      assigneeId: naorin.id,
      priority: Priority.HIGH,
      status: TaskStatus.TODO,
    }
  })

  await prisma.task.create({
    data: {
      title: 'Create Authentication API',
      description: 'Implement JWT based authentication',
      projectId: project3.id,
      createdById: admin.id,
      assigneeId: rahim.id,
      priority: Priority.URGENT,
      status: TaskStatus.IN_PROGRESS,
    }
  })

  await prisma.task.create({
    data: {
      title: 'Build Dashboard',
      description: 'Develop the main dashboard UI',
      projectId: project1.id,
      createdById: naorin.id,
      assigneeId: mila.id,
      priority: Priority.MEDIUM,
      status: TaskStatus.TODO,
    }
  })

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
