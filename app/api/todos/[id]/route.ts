import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function DELETE (req:NextRequest,{params}:{params:{id:string}}){

    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({message:"Unauthorized"},{status:403});
    }

    try {
        const todoId = params.id;

        const todo = await prisma.todo.findUnique({
            where:{
                id:todoId,
                
            }
          
        });

        if(!todo){
            return NextResponse.json({message:"Not Found"},{status:404});
        }

        if (todo.userId !== userId){
            return NextResponse.json({message:"Unauthorized"},{status:403});
        }

        await prisma.todo.delete({
            where:{
                id:todoId,
            }

        });

        return NextResponse.json({message:"Deleted"},{status:
        200});

    
    } catch (err) {
        console.error("Error deleting todo:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        
    }

}