"use client"

import StatsCards from "./StatsCards"
import AnalysisChart from "./AnalysisChart"
import VehiclesChart from "./VehiclesChart"
import QuickAccess from "./QuickAccess"
import PropertyTable from "./PropertyTable"

export default function Dashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* LEFT MAIN DASHBOARD */}
      <div className="flex-1 pt-2 px-6 space-y-6">
        <StatsCards />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-5 rounded-xl shadow">
            <AnalysisChart />
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <VehiclesChart />
          </div>
        </div>
        <QuickAccess />
        <PropertyTable />
      </div>


      {/* RIGHT SIDEBAR REMOVED */}

    </div>
  )
}