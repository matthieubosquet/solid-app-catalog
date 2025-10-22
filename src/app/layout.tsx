import type { Metadata } from "next";

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
