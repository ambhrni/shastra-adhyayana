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
          <div className="overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-stone prose-sm max-w-none
                         prose-headings:font-semibold prose-headings:text-stone-800
                         prose-strong:text-stone-800
                         prose-blockquote:border-l-4 prose-blockquote:border-saffron-400 prose-blockquote:text-stone-600
                         prose-table:w-full prose-table:border-collapse prose-table:text-sm
                         prose-thead:bg-stone-100
                         prose-th:border prose-th:border-stone-300 prose-th:px-3 prose-th:py-2 prose-th:text-stone-700 prose-th:font-semibold prose-th:text-left
                         prose-td:border prose-td:border-stone-300 prose-td:px-3 prose-td:py-2 prose-td:align-top
                         prose-code:text-stone-700"
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
