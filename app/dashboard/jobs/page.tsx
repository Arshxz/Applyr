import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import JobsList from '@/components/JobsList'

export default async function JobsPage() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect('/api/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ name: session.user?.name, email: session.user?.email }} />

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
