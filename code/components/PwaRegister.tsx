"use client";

import { useEffect } from "react";

export function PwaRegister() {
    useEffect(() => {
        // @ts-ignore
        if ("serviceWorker" in navigator && window.workbox !== undefined) {
            // @ts-ignore
            const wb = window.workbox;
            wb.register();
        }
    }, []);

    return null;
}
