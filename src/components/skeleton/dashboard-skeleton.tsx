import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-64 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
          <section className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border-border shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <Card key={i} className="h-[400px] border-border shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="flex items-end gap-2 h-[300px] pb-4 px-6">
                  {/* Simula as barras do gráfico em cinza padrão */}
                  {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                    <Skeleton
                      key={bar}
                      className="w-full rounded-t-md"
                      style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </section>
          <section className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>

            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Posts */}
            <Card className="h-[400px] border-border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {[1, 2, 3].map((post) => (
                  <div key={post} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="h-[400px] border-border shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[300px] gap-6">
                <Skeleton className="h-48 w-48 rounded-full" />
                <div className="flex gap-4 w-full px-8">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
