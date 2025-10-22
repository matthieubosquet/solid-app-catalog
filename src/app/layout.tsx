import type { Metadata } from "next";
import "@/app/global.css";

export const metadata: Metadata = {
    title: "Solid App Catalogue",
    description: "Authn browser & LDO & Next.js",
};

export default function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
