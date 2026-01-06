"use client";

import { UploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProcessingModal from "./ProcessingModel";
//import toast from "react-hot-toast"
/**
 * import ProcessingToast from "@/app/components/ProcessingToast";
function startProcessingToast(docId: string) {
  toast.custom(
    (t) => (

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-80">
  <ProcessingToast toastId={t} docId={docId} />
</div>

    ),
    { duration: Infinity }
  );
}
 * 
 */
export default function FileUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [processingDocId,setProcessingDocId]=useState<string |null >(null)

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      // Call your backend extraction API
      console.log("creating documents record",file_key,file_name)
      console.log("file key is:",file_key)
      console.log("file_name is:",file_name)
      const response=await axios.post("/api/documents", { 
        s3Key:file_key, 
        fileName:file_name})

      // Expect response.data = { documentId: string }
      return response.data;
    },
    /**
     * 
     * onSuccess(data) {
      toast.success("PDF record created successfully:",data.documentId);
      // Redirect to the new page showing the extracted text / summary
      router.push(`documents/${data.documentId}`)
      ;

      ;
    },
     */
    onSuccess(data) {
  const docId = data.documentId;

  toast.success("Upload successful");
  setProcessingDocId(docId)
  //startProcessingToast(docId);
},

    onError(error: any) {
      console.log("there is an error:",error)
      toast.error(
        error?.response?.data?.error || "Failed to create PDF record."
      );
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Max size is 10MB.");
        return;
      }
      try {
        setUploading(true);
        const data = await UploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Upload failed. Try again.");
          setUploading(false);
          return;
        }
        mutate(data);
      } catch (error) {
        toast.error("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="bg-white rounded-xl p-4 max-w-xl mx-auto">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-12 flex justify-center items-center h-48",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="mt-2 text-gray-600 text-sm">Extracting PDF text...</p>
          </>
        ) : (
          <>
            <Inbox className="h-10 w-10 text-blue-600" />
            <p className="mt-2 text-gray-400 text-sm ml-2 mr-6">Drop PDF here to upload</p>
          </>
        )}
        {processingDocId && (
  <ProcessingModal
    docId={processingDocId}
    onClose={() => setProcessingDocId(null)}
  />
)}

      </div>
    </div>
  );
}





/**
 * "use client"
import { UploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { Inbox, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
function FileUpload() {
  const router=useRouter()
  const [uploading,setUploading]=useState(false)
  const {mutate,isPending}=useMutation(
    {mutationFn:async ({file_key,file_name}:{
      file_key:string;
      file_name:string
    })=>{
      const response=await axios.post('/api/create-chat',{
        file_key,file_name
      })
      return response.data
    }}
  )
  const {getRootProps,getInputProps}=useDropzone({
    accept:{"application/pdf":[".pdf"]},
    maxFiles:1,
    onDrop:async (acceptedFiles)=>{
      const file=acceptedFiles[0]
      if (file.size > 10*1024*1024){
        toast.error("File too large")
        return
      }
      try {
        setUploading(true)
        const data=await UploadToS3(file)
        if (!data?.file_key || !data.file_name){
          
          toast.error("Something went wrong")
          return 
        }
        mutate(data,{
          onSuccess:({chat_id})=>{
            toast.success("chat has been created")
            router.push(`/chat/${chat_id}`)
            console.log(data)
            
          },
          onError:(err)=>{
            toast.error("Error creating chats")
            console.error(err)
            }

        })
      }
      catch (error){
        console.log(error)
      }
      finally{
        setUploading(false)
      }
      
    }
  })
  return (
    <div
    className='bg-white rounded-xl p-2'
    >
      <div {...getRootProps(
        {
        className:'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex  justify-center py-8 items-center h-40 w-80'
}
      )}>
        <input {...getInputProps()} />
        {(uploading || isPending) ?(
          <>
          <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
          <p className='mt-2 text-slate-500 text-sm'>Spilling the tea to ChatGPT...</p>
          </>
          
        ):(
          <>
        <Inbox className='2-10 h-10 text-blue-500' />
        <p className='mt-2  text-sm text-slate-400'>
          Drop PDF here
        </p>
        </>
        )}
        
        
      </div >
    </div>
  )
}

export default FileUpload
 */