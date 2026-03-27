export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Tattvasudhā</h1>
          <p className="mt-2 text-stone-500 font-devanagari text-lg">तत्त्वसुधा</p>
        </div>
        {children}
      </div>
    </div>
  )
}
