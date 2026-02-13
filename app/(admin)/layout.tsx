"use client";

import LeftSidebar from "../componnets/shared/LeftSidebar";
import Navbar from "../componnets/shared/Navbar";
import RightSidebar from "../componnets/shared/RightSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /**
     * Root container — full viewport height, no overflow on the outer shell.
     * Three columns: left sidebar | main area | right sidebar
     */
    <div className="h-screen w-screen flex overflow-hidden bg-gray-100">

      {/* ─── LEFT SIDEBAR ─── fixed width, full height, no scroll leakage */}
      <aside className="hidden lg:flex flex-shrink-0 w-[280px] h-full border-r border-gray-200 bg-white overflow-y-auto overflow-x-hidden">
        <LeftSidebar />
      </aside>

      {/* ─── CENTER COLUMN ─── fills remaining space between the two sidebars */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">

        {/* Sticky Navbar */}
        <header className="flex-shrink-0 z-20">
          <Navbar />
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">

          {/* Equal padding on all four sides; max-width keeps content readable */}
          <div className="p-6 w-full max-w-[1200px] mx-auto">

            {/* Card that wraps every page's content */}
            <div className="">
              {children}
            </div>

          </div>
        </main>
      </div>

      {/* ─── RIGHT SIDEBAR ─── mirror of left sidebar */}
      <aside className="hidden xl:flex flex-shrink-0 w-[280px] h-full border-l border-gray-200 bg-white overflow-y-auto overflow-x-hidden">
        <RightSidebar />
      </aside>

    </div>
  );
}