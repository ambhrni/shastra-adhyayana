import type { TutorMessage } from '@/types/database'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatMessage({ message }: { message: TutorMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
          isUser ? 'bg-saffron-500 text-white' : 'bg-stone-200 text-stone-600'
        }`}
      >
        {isUser ? 'Y' : 'V'}
      </div>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
          isUser
            ? 'bg-saffron-50 text-stone-800 border border-saffron-100 whitespace-pre-wrap'
            : 'bg-white text-stone-800 border border-stone-200'
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-stone prose-sm max-w-none
                       prose-headings:font-semibold prose-headings:text-stone-800
                       prose-strong:text-stone-800
                       prose-blockquote:border-l-4 prose-blockquote:border-saffron-400 prose-blockquote:text-stone-600
                       prose-code:text-stone-700"
            components={{
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-3">
                  <table
                    style={{borderCollapse: 'collapse', width: '100%', fontSize: '0.85em'}}
                    {...props}
                  />
                </div>
              ),
              th: ({node, ...props}) => (
                <th
                  style={{border: '1px solid #d6d3d1', padding: '6px 10px',
                          backgroundColor: '#f5f5f4', textAlign: 'left',
                          fontWeight: '600', color: '#44403c'}}
                  {...props}
                />
              ),
              td: ({node, ...props}) => (
                <td
                  style={{border: '1px solid #d6d3d1', padding: '6px 10px',
                          verticalAlign: 'top'}}
                  {...props}
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
