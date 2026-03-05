"use client";

import { useEffect, useState } from "react";
import { Toast } from "@capacitor/toast";

export default function NetworkStatusTracker() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Only run in the browser
        if (typeof window === "undefined") return;

        const handleOffline = async () => {
            setIsOffline(true);
            try {
                await Toast.show({
                    text: 'İnternet bağlantısı koptu. Çevrimdışı moddasınız.',
                    duration: 'long',
                    position: 'top',
                });
            } catch (e) {
                // Fallback for non-capacitor environments
                console.warn("Toast plugin failed or unavailable", e);
            }
        };

        const handleOnline = async () => {
            if (isOffline) {
                setIsOffline(false);
                try {
                    await Toast.show({
                        text: 'Bağlantı sağlandı. Çevrimiçi moddasınız.',
                        duration: 'short',
                        position: 'top',
                    });
                } catch (e) {
                    console.warn("Toast plugin failed", e);
                }
            }
        };

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        // Initial check
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, [isOffline]);

    return null;
}
