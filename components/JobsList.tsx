'use client'

import { useEffect, useState } from 'react'

interface Job {
  id: string
  company: string
  title: string
  location: string | null
  apply_url: string
  source: string
  last_seen: string
}

interface JobsResponse {
  jobs: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<JobsResponse['pagination'] | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [page])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs?page=${page}&limit=20`)
      const data: JobsResponse = await res.json()
      setJobs(data.jobs)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId }),
      })

      if (res.ok) {
        alert('Application submitted! Our bot will handle the rest.')
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error applying:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading jobs...</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No jobs found. Our bot is working on it!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-indigo-600 font-medium mb-2">{job.company}</p>
                {job.location && (
                  <p className="text-gray-600 text-sm mb-2">📍 {job.location}</p>
                )}
                <div className="flex gap-2 items-center">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {job.source}
                  </span>
                  <span className="text-xs text-gray-500">
                    Last seen: {new Date(job.last_seen).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleApply(job.id)}
                className="ml-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
