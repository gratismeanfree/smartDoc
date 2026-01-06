"use client"
import { useState,useEffect } from "react"
export function useProgressBar(active:boolean ){
  const [progress,setProgress]=useState(0)
  useEffect(()=>{
    if (!active) return;
    const interval=setInterval(()=>{
      setProgress((p)=>{
        if (p >= 85) return p;
        return Math.min(p + Math.random() * 6, 85);
      })
    },700);
    return () =>clearInterval(interval)
  },[active])
  return {progress,setProgress}
}