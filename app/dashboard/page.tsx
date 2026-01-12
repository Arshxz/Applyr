import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect('/api/auth/login')
  }

  // Get or create user
  let user = await prisma.user.findUnique({
    where: { auth0_id: session.user.sub },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        auth0_id: session.user.sub,
        email: session.user.email || '',
        name: session.user.name || null,
      },
    })
  }

  // Get jobs count (from cache if possible)
  const jobsCount = await prisma.job.count()
  const applicationsCount = await prisma.application.count({
    where: { user_id: user.id },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your overview.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-indigo-600">{jobsCount.toLocaleString()}</div>
            <div className="text-gray-600 mt-1">Available Jobs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{applicationsCount}</div>
            <div className="text-gray-600 mt-1">Your Applications</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{user.plan}</div>
            <div className="text-gray-600 mt-1">Current Plan</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <Link 
              href="/dashboard/jobs" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link 
              href="/dashboard/profile" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Profile
            </Link>
            <Link 
              href="/dashboard/applications" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Applications
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
