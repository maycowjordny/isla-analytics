import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const presets = [
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
  { label: "60 days", days: 60 },
  { label: "90 days", days: 90 },
];

export function DateRangeFilter({
  dateRange,
  onDateRangeChange,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = (days: number) => {
    const to = new Date();
    const from = subDays(to, days - 1);
    onDateRangeChange({ from, to });
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    if (dateRange?.from) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    return "Select date range";
  };

  const getActivePreset = () => {
    if (!dateRange?.from || !dateRange?.to) return null;
    const diffDays =
      Math.round(
        (dateRange.to.getTime() - dateRange.from.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;
    return presets.find((p) => p.days === diffDays)?.days || null;
  };

  const activePreset = getActivePreset();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
        {presets.slice(0, 4).map((preset) => (
          <Button
            key={preset.days}
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-3 text-xs font-medium transition-all",
              activePreset === preset.days
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            onClick={() => handlePresetClick(preset.days)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 gap-2 border-border/50 bg-muted/30 justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="hidden xs:inline">{formatDateRange()}</span>
            <span className="xs:hidden">
              {dateRange?.from ? format(dateRange.from, "MMM d") : "Select"}
            </span>
            <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-3 bg-muted/20 md:w-48">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Quick select
              </p>
              <div className="grid grid-cols-2 gap-1 md:flex md:flex-col">
                {presets.map((preset) => (
                  <Button
                    key={preset.days}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start h-8 text-sm",
                      activePreset === preset.days &&
                        "bg-accent text-accent-foreground",
                    )}
                    onClick={() => handlePresetClick(preset.days)}
                  >
                    Last {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-3">
              <div className="md:hidden">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={1}
                  defaultMonth={dateRange?.from}
                  disabled={(date) => date > new Date()}
                />
              </div>
              <div className="hidden md:block">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                  defaultMonth={dateRange?.from}
                  disabled={(date) => date > new Date()}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
