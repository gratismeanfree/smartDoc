import React from 'react'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { LogIn } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
async function page() {
  const {userId}=await auth()
  const isAuth= !! userId
  return (
    <div className='w-screen min-h-screen bg-gradient-to-br 
from-rose-100 
via-orange-100 
to-sky-200'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
      <div className='flex flex-colums items-center
      text-center'>
        <div className='
        flex flex-col items-center'>
         <h1 className='mr-3 font-semibold text-3xl'>
          Leverage any PDF and save your time. </h1> 
          <div className='flex mt-2'>
            {isAuth &&<Button>Go to Chats</Button>}
          </div>
          <p className='max-w-xl mt-2 mb-4 text-lg'>Join thousands of professionals to understand documents faster</p>
          <div>{
            isAuth ? (<FileUpload />): (
              <Link href="/sign-in">
                <Button>
                  Login to get started!
                  <LogIn className='w-4 h-4 ml-2' />
                  </Button></Link>

            )}</div>
        </div>
      </div>
      </div>



    </div>
  )
}

export default page