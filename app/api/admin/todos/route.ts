import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import prisma from "@/lib/prisma";

// Function to check if the user is an admin
async function isAdmin(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return user.privateMetadata?.role === "admin"; // Safe check for role
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  // Check if the user is an admin
  if (!(await isAdmin(userId))) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const todoId = params.id;

    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    await prisma.todo.delete({
      where: { id: todoId },
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting todo:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
