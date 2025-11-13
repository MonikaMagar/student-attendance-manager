export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About StudentTrack</h1>
        <div className="prose prose-lg text-gray-500">
          <p>
            StudentTrack is a comprehensive student attendance management system designed to 
            streamline the process of tracking and managing student attendance for educational 
            institutions.
          </p>
          <p>
            Our platform provides teachers with powerful tools to manage students, create batches, 
            mark attendance, and generate reports, while giving students easy access to their 
            attendance records and progress.
          </p>
        </div>
      </div>
    </div>
  )
}