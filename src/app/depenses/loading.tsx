import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DepensesLoading() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Skeleton className="h-10 w-full sm:max-w-xs" />
            <Skeleton className="h-10 w-44" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}
