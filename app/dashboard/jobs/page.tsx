import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import JobsList from '@/components/JobsList'

export default async function JobsPage() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect('/api/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
            Applyr
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
            <Link 
              href="/api/auth/logout" 
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </div>

        <JobsList />
      </main>
    </div>
  )
}
