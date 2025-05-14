import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/pipeline", label: "Pipeline", icon: "trending_up" },
  { href: "/forecasting", label: "Forecasting", icon: "bar_chart" },
  { href: "/vendors", label: "Vendors", icon: "people" },
  { href: "/contracts", label: "Contracts", icon: "assignment" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">ProcurePro</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a 
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    location === item.href
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <span className="material-icons text-sm mr-3">{item.icon}</span>
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center px-3 py-2 space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">JD</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">John Doe</p>
            <p className="text-xs text-slate-500">Procurement Manager</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <span className="material-icons text-sm">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
