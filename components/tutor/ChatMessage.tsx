import type { TutorMessage } from '@/types/database'

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
        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-saffron-50 text-stone-800 border border-saffron-100'
            : 'bg-white text-stone-800 border border-stone-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
