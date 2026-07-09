import { Skeleton } from "@/components/ui/skeleton";

export default function PublicoLoading() {
  return (
    <section className="space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </section>
  );
}
