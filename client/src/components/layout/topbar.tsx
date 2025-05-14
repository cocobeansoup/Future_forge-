import { useLocation } from "wouter";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [location] = useLocation();
  
  // Function to get the page title based on the current location
  const getPageTitle = () => {
    const routes: Record<string, string> = {
      "/": "Dashboard",
      "/pipeline": "Pipeline",
      "/forecasting": "Forecasting",
      "/vendors": "Vendors",
      "/contracts": "Contracts",
      "/settings": "Settings",
    };
    
    return routes[location] || "Dashboard";
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center md:hidden">
          <button 
            className="p-1 rounded-md hover:bg-slate-100"
            onClick={onMenuClick}
          >
            <span className="material-icons text-slate-500">menu</span>
          </button>
          <h1 className="ml-2 text-lg font-bold text-slate-800">ProcurePro</h1>
        </div>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="material-icons text-slate-400 absolute left-3 top-2.5 text-sm">search</span>
          </div>
          
          <button className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
            <span className="material-icons">notifications</span>
          </button>
          
          <button className="md:hidden p-1 rounded-md text-slate-500 hover:bg-slate-100">
            <span className="material-icons">search</span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-slate-200 md:hidden flex items-center justify-center text-slate-700">JD</div>
        </div>
      </div>
    </header>
  );
}
