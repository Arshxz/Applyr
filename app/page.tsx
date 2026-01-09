import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">Applyr</div>
        <div className="flex gap-4">
          <Link 
            href="/api/auth/login" 
            className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Log in
          </Link>
          <Link 
            href="/api/auth/login" 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            One Profile.
            <br />
            <span className="text-indigo-600">Apply Everywhere.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your bot does all the dirty work. Browse jobs, apply with one click, 
            and never leave Applyr. We handle the rest.
          </p>
          
          <div className="flex gap-4 justify-center mb-20">
            <Link 
              href="/api/auth/login" 
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
            >
              Start Applying
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold border-2 border-indigo-600"
            >
              View Jobs
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Smart Bot</h3>
              <p className="text-gray-600">
                Our bot scrapes the internet, finds jobs, and collects application questions automatically.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">One-Click Apply</h3>
              <p className="text-gray-600">
                Apply to any job with a single click. No external redirects, no repeated forms.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Universal Profile</h3>
              <p className="text-gray-600">
                One profile that works everywhere. We adapt it to each company's requirements.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2024 Applyr. Built for job seekers who value their time.</p>
      </footer>
    </div>
  )
}
