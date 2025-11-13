export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Features</h1>
        <div className="prose prose-lg text-gray-500">
          <h2>For Teachers</h2>
          <ul>
            <li>Student management and account creation</li>
            <li>Batch creation and scheduling</li>
            <li>Bulk attendance marking</li>
            <li>Attendance record management</li>
            <li>Comprehensive reporting and analytics</li>
          </ul>
          
          <h2>For Students</h2>
          <ul>
            <li>Personal attendance dashboard</li>
            <li>Attendance history and trends</li>
            <li>Batch schedule viewing</li>
            <li>Attendance percentage tracking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}