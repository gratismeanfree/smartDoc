import React from 'react'
import type {UIMessage} from "@ai-sdk/react"
import { cn } from '@/lib/utils'

type Props={

  messages:UIMessage[]
}

const MessageList = ({messages}:Props) => {
  if (!messages) return <></>
  return (
    <div className='flex flex-col gap-2 px-4'>
      {messages.map(message=>{
         const content = message.parts
          .map(part => part.type === 'text' ? part.text : '')
          .join('');
        return (
          <div key={message.id}
          className={cn('flex',{'justify-end pl-10':message.role==='user',
            'justify-start pr-10':message.role==='assistant'
          })}>
            <div className={
              cn('rounded-lg px-3 text-sm shadow-md py-1 ring-gray-900/10',{
                'bg-blue-600 text-white':message.role==='user'
              })
            }>
              <p>{content}</p>
            </div>

          </div>
        )
      })}

    </div>
  )
}

export default MessageList