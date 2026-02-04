'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * A client-side hook that triggers the browser's print dialog
 * if a specific query parameter is present in the URL.
 * @param queryParam The name of the query parameter to check for (defaults to 'print').
 */
export function usePrintOnLoad(queryParam: string = 'print') {
    const searchParams = useSearchParams();

    useEffect(() => {
        const shouldPrint = searchParams.get(queryParam);
        if (shouldPrint === 'true') {
            // A small delay ensures the page has rendered before the print dialog appears.
            const timeoutId = setTimeout(() => {
                window.print();
            }, 500); 
            
            // Cleanup the timer if the component unmounts.
            return () => clearTimeout(timeoutId);
        }
    }, [searchParams, queryParam]);
}
