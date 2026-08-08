import { Skeleton } from "@/shared/ui/skeleton";

export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 py-2 px-[8px]">
      <Skeleton className="w-12 h-12 rounded-[10px] shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
