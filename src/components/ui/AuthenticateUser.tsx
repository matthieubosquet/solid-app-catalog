"use client";

import { useState } from "react";
import { login } from "@inrupt/solid-client-authn-browser";
import style from "../../styles/AuthenticateUserStyle.module.css";

const OIDC_ISSUERS = [
    { label: "Solid Community", value: "https://solidcommunity.net/" },
    { label: "Inrupt", value: "https://login.inrupt.com" },
] as const;

export function AuthenticateUser() {
    const [selectedIssuer, setSelectedIssuer] = useState<string>(OIDC_ISSUERS[0].value);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await login({
                oidcIssuer: selectedIssuer,
                clientName: "Solid List Items App",
                redirectUrl: window.location.href,
            });
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
        }
    };

    return (
        <main className={style.container}>
            <section className={style.card}>

                <div className={style.form}>
                    <label className={style.label}>
                        <span className={style.label_text}>Solid Identity Provider</span>
                        <select
                            value={selectedIssuer}
                            onChange={(e) => setSelectedIssuer(e.target.value)}
                            className={style.select}
                            disabled={isLoading}
                        >
                            {OIDC_ISSUERS.map((issuer) => (
                                <option key={issuer.value} value={issuer.value}>
                                    {issuer.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        onClick={handleLogin}
                        className={style.login_button}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </section>
        </main>
    );
}

