export function ProgymFooter() {
    return (
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <p>Progymnasmata — Classical rhetorical exercises</p>
            <p className="mt-2 md:mt-0">© {new Date().getFullYear()} Kris Yotam</p>
          </div>
        </div>
      </footer>
    )
  }
  
  