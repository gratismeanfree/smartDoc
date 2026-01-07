import { childSend } from "bullmq"
import ReactMarkdown from "react-markdown"
interface MarkdownType {
  markdown:string |null
}
export function SummaryRenderer({markdown}:MarkdownType) {
  if (!markdown){
    return <p>No summary found</p>
  }
  
  const cleanedMarkdown = markdown
  .replace(/^```markdown\s*/g, "")
  .replace(/^```\s*$/g, "");
  
 

  return (
    <article className="max-w-none">
      <ReactMarkdown
      components={{
        h2:({children})=>(
          <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-600">{children}</h2>
        ),
        ul:({children})=>(
          <ul className="list-disc pl-5 space-y-1">{children}</ul>
        ),
        li:({children})=>(
          <li className="text-sm text-black leading-relaxed">{children}</li>
        )
      }}
      >
        {cleanedMarkdown}
      </ReactMarkdown>
    </article>
  )
}