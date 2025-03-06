import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";


export async function POST(){

    const {userId}= await auth()

    if(!userId){
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    try {
       const user= await prisma.user.findUnique({where:{id:userId}})

       if (!user) {
        return NextResponse.json({ message: "User not Found" }, { status: 403 })
       }

       const subscriptionEnds=new Date()

       subscriptionEnds.setMonth(subscriptionEnds.getMonth()+1)

       //now querie for update
       
    const updateUser=   await prisma.user.update({
              where:{id:userId},
              data:{
                isSubscribed:true,
                subscriptionEnds:subscriptionEnds
              }
       })

       return NextResponse.json({ message: "Subscription Updated",subscriptionEnds:updateUser.subscriptionEnds }, { status: 200 })

        
    } catch (err) {
        console.error(
            'Error in subscription route',
            err
        )
        return NextResponse.json({ message: err instanceof Error ? err.message : 'Unknown error' }, { status
            : 500 })
    }

}

export async function GET(){
    const {userId}= await auth()

    if(!userId){
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }
    try {
        const user= await prisma.user.findUnique({
            where:{id:userId},
            select:{
                isSubscribed:true,
                subscriptionEnds:true
            }
        })

        if (!user) {
         return NextResponse.json({ message: "User not Found" }, { status: 403 })
        }

        const now = new Date()

        if (user.subscriptionEnds && user.subscriptionEnds<now){
            await prisma.user.update({
                where:{id:userId},
                data:{
                    isSubscribed:false,
                    subscriptionEnds:null
                }
            })

            return NextResponse.json({ message: "Subscription Ended",subscriptionEnds:null }, { status: 200 })
        }

        return NextResponse.json({ message: "Subscription Active",subscriptionEnds:user.subscriptionEnds }, { status: 200 })
 
        
    } catch (err) {
        console.error(
            'Error in subscription route',
            err
        )
        return NextResponse.json({ message: err instanceof Error ? err.message : 'Unknown error' }, { status
            : 500 })
        
    }
    
}