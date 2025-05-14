import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/pipeline", label: "Pipeline", icon: "trending_up" },
  { href: "/forecasting", label: "Forecast", icon: "bar_chart" },
  { href: "/more", label: "More", icon: "more_horiz" },
];

export default function MobileNavigation() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-10">
      <div className="flex justify-around">
        {mobileNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a 
              className={cn(
                "flex flex-col items-center py-2 px-4",
                location === item.href ? "text-primary-600" : "text-slate-500"
              )}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
