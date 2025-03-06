import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    const totalItems = await prisma.todo.count({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return NextResponse.json({ todos, currentPage: page, totalPages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { todos: true },
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.isSubscribed && user.todos.length >= 3) {
        return NextResponse.json({ message: "Upgrade to premium to add more todos" }, { status: 403 });
    }

    const { title } = await req.json();
    
    if (!title) {
       return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const todo = await prisma.todo.create({
        data: {
            title,
            userId
        }
    });

    return NextResponse.json(todo, { status: 201 });
}
