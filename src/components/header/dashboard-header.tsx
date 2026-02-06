import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Settings, Upload } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { DateRangeFilter } from "../filter/date-range-filter";

type DashboardHeaderProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onUploadClick: () => void;
};

export function DashboardHeader({
  dateRange,
  onDateRangeChange,
  onUploadClick,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 mb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Weekly Brand Report
          </h1>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onUploadClick}>
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload New Week</span>
            <span className="sm:hidden">Upload</span>
          </Button>

          <div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <DateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />
    </header>
  );
}
