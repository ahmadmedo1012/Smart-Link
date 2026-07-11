import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h2>
        <p className="text-[var(--muted-foreground)] mb-8">عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
