import React from 'react'

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50
    dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin
          dark:border-green-400 dark:border-t-transparent"></div>

          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 text-green-800 animate-pulse font-extrabold mr-5 text-xl dark:text-green-400">DHA</div>
          </div>
        </div>
      </div>
  )
}

export default Loader