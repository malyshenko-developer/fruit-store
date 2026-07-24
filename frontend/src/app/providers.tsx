"use client";

import {ReactNode, useState} from "react";
import {makeQueryClient} from "@/shared/api/queryClient";
import {QueryClientProvider} from "@tanstack/react-query";

export function Providers({children}: {children: ReactNode}) {
    const [queryClient] = useState(() => makeQueryClient())

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}