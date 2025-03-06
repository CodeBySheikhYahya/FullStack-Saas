import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";



export async function POST (req:Request){
  const Webhook_Secret=  process.env.WEBHOOK_SECRET_KEY

  if(!Webhook_Secret) {
    throw new Error("Webhook Secret is not set")
  }
  const headerPayload = await headers();
const svix_id=  headerPayload.get("svix-id")
const svix_timestamp = headerPayload.get("svix-timestamp")
const svix_signature = headerPayload.get("svix-signature")

if(!svix_id || !svix_timestamp || !svix_signature){
    return new Response("Missing headers", {status:400})
    
}

const payload=await req.json()

const body=JSON.stringify(payload)

const wh = new Webhook(Webhook_Secret);

let evt:WebhookEvent; 

try {
 evt= wh.verify(body, {
  "svix-id":svix_id ,
  "svix-timestamp": svix_timestamp,
  "svix-signature": svix_signature
 } ) as WebhookEvent;
  
} catch (err) {
  console.error("Error verifying webhook", err)
  return new Response("Invalid signature", {status:400})
  
}

const {id} = evt.data
const evenType =evt.type

if (evenType==="user.created")
  {
    try {
const {email_addresses,primary_email_address_id}= evt.data


console.log("User created", id, email_addresses, primary_email_address_id)

const primaryEmail=email_addresses.find((email)=> email.id===primary_email_address_id)

if(!primaryEmail){
  console.error("Primary email not found")
  return new Response("Primary email not found", {status:400})
}

// create a user  in neon  (postgresql)

const user= await prisma.user.create({
  data:{
    id:evt.data.id,
    email:primaryEmail.email_address,
    isSubscribed:false
  }
  
})

console.log("User created in neon", user)
    } catch (err) {

      return new Response("Error creating user", {status:500})



      
    }

}

return new Response("OK", {status:200})


}

