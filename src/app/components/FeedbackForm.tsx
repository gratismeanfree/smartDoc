"use client"
import {useState} from "react"
import { setTimeout } from "timers/promises";
import { useRouter } from "next/router";
export default function FeedbackForm () {
  const router=useRouter()
  const [type,setType]=useState("")
  const [message,setMessage]=useState("");
  const [loading,setloading]=useState(false)
  const [email,setEmail]=useState("");
  const [success,setSucess]=useState(false);
  const submit=async () => {
    if (!message.trim()) return;
    setloading(true);
    const res=await fetch("/api/feedback",
      {method:"POST",
      headers:{"Content-Type":"applicaiton/json"},
    body:JSON.stringify({
      type,message,email
    })}
    );
    
    setloading(false)
    if (res.ok){
      setSucess(true);
      window.setTimeout(() => {
        router.push("/")
      },1200)

    }
  };
  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Give Feedback</h1>
      <p className="text-gray-500">Help us improve your experience</p>
      <select
      value={type}
      onChange={(e)=>setType(e.target.value)}
      className="w-full border rounded-lg p-2"
      >
        <option value="bug">Bug</option>
        <option value="feature">Feature Request</option>
        <option value="idea">Idea</option>
        <option value="other"
        >Other</option>
        
      </select>
      <textarea
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      placeholder="Describe your feedback..."
      rows={6}
      className="w-full border rounded-lg p-3"
      />
      <input
      value={email}
      onChange={(e)=>setEmail(e.target.value)}
      placeholder="Your email"
      className="w-full border rounded-lg p-2"
      
      />
      <button
      onClick={submit}
      disabled={loading}
      className="w-full bg-black text-white rounded-lg py-2"
      >
        {loading? "Sending...":"Feedback sent!"}

      </button>
      {success && (
        <p>Thank you for your feedback! ❤️</p>
      )}
    </div>
  )

}