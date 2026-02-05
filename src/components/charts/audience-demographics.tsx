import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building, Building2, MapPin, Users } from "lucide-react";

type DemographicItem = {
  name: string;
  percentage: number;
};

type AudienceData = {
  jobTitles: DemographicItem[];
  locations: DemographicItem[];
  industries: DemographicItem[];
  seniority: DemographicItem[];
  companySize: DemographicItem[];
};

type AudienceDemographicsProps = {
  data: AudienceData;
};

function DemographicBar({
  item,
  maxPercentage,
}: {
  item: DemographicItem;
  maxPercentage: number;
}) {
  const width = (item.percentage / maxPercentage) * 100;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
          {item.name}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {item.percentage.toFixed(1)}%
        </span>
      </div>
      <div className="demo-bar">
        <div className="demo-bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function DemographicList({ items }: { items: DemographicItem[] }) {
  const maxPercentage = Math.max(...items.map((i) => i.percentage));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <DemographicBar key={index} item={item} maxPercentage={maxPercentage} />
      ))}
    </div>
  );
}

export function AudienceDemographics({ data }: AudienceDemographicsProps) {
  return (
    <div
      className="chart-card animate-fade-in"
      style={{ animationDelay: "500ms" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Audience Profile
        </h3>
        <p className="text-sm text-muted-foreground">
          Who's engaging with your content
        </p>
      </div>

      <Tabs defaultValue="titles" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="titles" className="text-xs">
            <Briefcase className="w-3 h-3 mr-1 hidden sm:inline" />
            Titles
          </TabsTrigger>
          <TabsTrigger value="locations" className="text-xs">
            <MapPin className="w-3 h-3 mr-1 hidden sm:inline" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="industries" className="text-xs">
            <Building2 className="w-3 h-3 mr-1 hidden sm:inline" />
            Industries
          </TabsTrigger>
          <TabsTrigger value="seniority" className="text-xs">
            <Users className="w-3 h-3 mr-1 hidden sm:inline" />
            Seniority
          </TabsTrigger>
          <TabsTrigger value="size" className="text-xs">
            <Building className="w-3 h-3 mr-1 hidden sm:inline" />
            Size
          </TabsTrigger>
        </TabsList>

        <TabsContent value="titles">
          <DemographicList items={data.jobTitles} />
        </TabsContent>

        <TabsContent value="locations">
          <DemographicList items={data.locations} />
        </TabsContent>

        <TabsContent value="industries">
          <DemographicList items={data.industries} />
        </TabsContent>

        <TabsContent value="seniority">
          <DemographicList items={data.seniority} />
        </TabsContent>

        <TabsContent value="size">
          <DemographicList items={data.companySize} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
