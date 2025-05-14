import { getChangeIndicator, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  changeValue: number;
  comparisonText?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  changeValue,
  comparisonText = "vs last month"
}: MetricCardProps) {
  const { color, icon: changeIcon } = getChangeIndicator(changeValue);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
          </div>
          <div className={`p-2 ${iconBgColor} rounded-md`}>
            <span className={`material-icons ${iconColor}`}>{icon}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`${color} text-sm font-medium flex items-center`}>
            <span className="material-icons text-xs mr-1">{changeIcon}</span>
            {Math.abs(changeValue)}%
          </span>
          <span className="text-slate-500 text-sm ml-2">{comparisonText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
