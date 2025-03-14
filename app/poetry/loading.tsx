export default function Loading() {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
  
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
  
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 h-64">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                  <div className="mt-auto h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  