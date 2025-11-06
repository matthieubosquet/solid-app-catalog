"use client";

import { useEffect, useState } from "react";
import { getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import { ListEditor } from "../../components/ui/ListEditor";
import { AuthenticateUser } from "../../components/ui/AuthenticateUser";

/**
 * This is the admin page.
 * It is available (by default) at http://localhost:3000/admin
 * It is used to create and delete list items.
 * Shows authentication UI if user is not authenticated, otherwise shows ListEditor.
 */
export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                await handleIncomingRedirect();
                const session = getDefaultSession();
                setIsAuthenticated(session.info.isLoggedIn);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        }

        checkAuth();
    }, []);

    // Re-check authentication state periodically in case user logs in from another tab
    useEffect(() => {
        if (!isAuthenticated) {
            const interval = setInterval(async () => {
                await handleIncomingRedirect();
                const session = getDefaultSession();
                if (session.info.isLoggedIn) {
                    setIsAuthenticated(true);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    if (isChecking) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: 'calc(100vh - 4rem)',
                color: '#000'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AuthenticateUser />;
    }

    return <ListEditor />;
}
