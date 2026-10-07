import { NextResponse } from 'next/server';
import { PrismaClient, User, Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function getUserFromRequest(req: Request): Promise<User | null> {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );

  const token = cookies['token'];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET || 'your-secret') as { userId: String, role: Role };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId as string },
    });
    return user;
  } catch (error) {
    return null;
  }
}
