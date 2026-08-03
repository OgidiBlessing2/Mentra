import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">

          <div className="max-w-7xl mx-auto">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}