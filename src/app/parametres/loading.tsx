import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ParametresLoading() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-72" />
      </header>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-56 mb-2" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-end gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
