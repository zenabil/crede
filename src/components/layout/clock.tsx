'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock as ClockIcon } from 'lucide-react';

export function Clock() {
  const [time, setTime] = useState<Date>();

  useEffect(() => {
    // This effect runs only on the client, which prevents hydration mismatch.
    setTime(new Date());
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Render nothing on the server and on the initial client render
  // This is a robust way to avoid hydration errors with time.
  if (!time) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center gap-3 text-sm font-medium border rounded-full px-4 py-1 bg-background/70 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">{formatDate(time)}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <ClockIcon className="h-4 w-4 text-primary" />
        <span className="text-foreground font-semibold tabular-nums tracking-wider font-mono">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
}
