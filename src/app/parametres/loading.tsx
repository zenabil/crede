import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <header>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </header>

      <div>
        <div className="flex mb-1 h-10">
            <Skeleton className="w-1/3 rounded-md border-b-0 rounded-b-none" />
            <Skeleton className="w-1/3 rounded-md border-b-0 rounded-b-none bg-background" />
            <Skeleton className="w-1/3 rounded-md border-b-0 rounded-b-none bg-background" />
        </div>
        <Card className="mt-0">
            <CardHeader>
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
