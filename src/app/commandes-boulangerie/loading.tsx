'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <header>
        <Skeleton className="h-9 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </header>

      <div className="flex flex-col sm:flex-row gap-2">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-full sm:w-[180px]" />
        <Skeleton className="h-10 w-full sm:w-28" />
        <Skeleton className="h-10 w-full sm:w-36" />
        <Skeleton className="h-10 w-full sm:w-28" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-12" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-8" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-8" />
          </CardContent>
        </Card>
      </div>

      <Skeleton className="h-32 w-full" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-5 w-5 rounded-sm mt-1" />
              <div className="flex-grow space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
