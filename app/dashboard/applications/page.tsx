import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

export default async function ApplicationsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  // Find or create user (same as dashboard behavior)
  let user = await prisma.user.findUnique({
    where: { auth0_id: session.user.sub },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        auth0_id: session.user.sub,
        email: session.user.email || "",
        name: session.user.name || null,
      },
    });
  }

  const applications = await prisma.application.findMany({
    where: { user_id: user.id },
    include: { job: true },
    orderBy: { created_at: "desc" },
  });

  const count = applications.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Applications
          </h1>
          <p className="text-gray-600">
            You have applied to <strong>{count}</strong> job
            {count === 1 ? "" : "s"}.
          </p>
        </div>
        {count === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
            <p className="text-xl">0 jobs applied</p>
            <p className="mt-2">
              You haven&apos;t applied to any jobs yet. Browse jobs to get started.
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/jobs"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.job?.title || "Unknown role"}
                  </h3>
                  <p className="text-gray-600">Status: {app.status}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied on: {new Date(app.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
