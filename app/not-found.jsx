import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black px-4">
      <div className="text-center">
        <p className="display-heading text-[8rem] leading-none text-white/5 select-none">404</p>
        <p className="section-label mb-3 -mt-8">Page Not Found</p>
        <h1 className="display-heading text-5xl text-white mb-5">NOT HERE</h1>
        <p className="text-white/40 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
