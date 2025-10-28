import type { Metadata } from "next";
import "./global.css";

/**
 * This is the default metadata of the Next.js application.
 * In this application it is used by all pages.
 * @see {@link https://nextjs.org/docs/app/getting-started/metadata-and-og-images#static-metadata}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata}
 */
export const metadata: Metadata = {
    title: "Solid List Items",
    description: "Authn browser & LDO & Next.js",
};

/**
 * This is the root layout of the Next.js application.
 * In this application it is used by all pages.
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout}
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#the-root-layout}
 */
export default function ({ children }: LayoutProps) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}

/**
 * This structure defines the shape of the properties passed to the root layout component.
 */
type LayoutProps = Readonly<{
    children: React.ReactNode;
}>;
