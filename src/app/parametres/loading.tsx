import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <header>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </header>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
           <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
           <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-64" />
        </CardContent>
      </Card>
    </div>
  );
}
