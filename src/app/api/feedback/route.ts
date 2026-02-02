import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { feedback } from "@/app/lib/db/schema";
import { error } from "console";
import {Resend} from "resend"
const resend= new Resend(process.env.RESEND_API_KEY)
export async function POST (req:Request){
  try {
    const {userId,email,type,message}= await req.json()
    await db.insert(feedback).values({
      userId,
      email,
      type,
      message
    });
    if (error) throw error
;
await resend.emails.send({
  from: 'ChatPDF <onboarding@resend.dev>',
  to:["phuonganhnguyenomg@gmail.com"],
  subject:`New Feedback-${type}`,
  html:`
  <h2>New Feedback</h2>
  <p><b>Type:</b>${type}</p>
  <p><b>Email:</b>${email|| "Not provided"}</p>
  <p>${message}</p>
  `

});
return NextResponse.json({success:true}); 
  }catch (err) {
    console.error(err);
    return NextResponse.json({error:"Failed"},{status:500})
  }
}