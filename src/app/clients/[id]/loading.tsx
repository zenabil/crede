import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerDetailLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-left sm:text-right">
                  <Skeleton className="h-4 w-24 ml-auto mb-1" />
                  <Skeleton className="h-8 w-32 ml-auto" />
                </div>
                <div className="flex items-center gap-1 border-l pl-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Skeleton className="h-8 w-1/4" />
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
