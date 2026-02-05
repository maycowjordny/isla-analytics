import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <main className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64 bg-skeleton" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-xl bg-skeleton" />
              <Skeleton className="h-10 w-10 rounded-full bg-skeleton" />
              <Skeleton className="h-10 w-10 rounded-full bg-skeleton" />
            </div>
          </div>
          <Skeleton className="h-12 w-full sm:w-75 rounded-xl bg-skeleton" />
        </div>
        <section className="mb-8">
          <Skeleton className="h-7 w-48 mb-4 bg-skeleton" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="border-slate-100 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-skeleton" />
                    <Skeleton className="h-8 w-8 rounded-lg bg-skeleton" />
                  </div>
                  <Skeleton className="h-8 w-24 bg-skeleton" />
                  <Skeleton className="h-4 w-16 bg-skeleton" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[1, 2].map((i) => (
            <Card key={i} className="h-100">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-skeleton" />
              </CardHeader>
              <CardContent className="flex items-end gap-2 h-112.5">
                {[1, 2, 3, 4, 5, 6].map((bar) => (
                  <Skeleton
                    key={bar}
                    className="w-full bg-skeleton"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="h-112.5">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-skeleton" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg bg-skeleton" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full bg-skeleton" />
                    <Skeleton className="h-3 w-2/3 bg-skeleton" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="h-112.5">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-skeleton" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6">
              <Skeleton className="h-48 w-48 rounded-full bg-skeleton" />
              <div className="grid grid-cols-2 gap-4 w-full">
                <Skeleton className="h-10 w-full bg-skeleton" />
                <Skeleton className="h-10 w-full bg-skeleton" />
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="mb-8">
          <Card className="p-8 space-y-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48 bg-skeleton" />
                <Skeleton className="h-4 w-32 bg-skeleton" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg bg-skeleton" />
            </div>
            <div className="space-y-4 border-t pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl bg-skeleton" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 bg-skeleton" />
                    <Skeleton className="h-4 w-full bg-skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
