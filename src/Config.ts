const errorTemplate = "Could not find required environment variable: ";

/**
 * Retrieve environment variables
 */
export class Config {
    public static get baseUri(): string {
        const value = process.env.NEXT_PUBLIC_BASE_URI;
        if (value === undefined) {
            throw new Error(`${errorTemplate}NEXT_PUBLIC_BASE_URI`);
        }

        return value;
    }

    public static get manifestResourceUri(): string {
        const value = process.env.NEXT_PUBLIC_MANIFEST_RESOURCE_URI;
        if (value === undefined) {
            throw new Error(
                `${errorTemplate}NEXT_PUBLIC_MANIFEST_RESOURCE_URI`
            );
        }

        return value;
    }

    public static get adminWebID(): string {
        const value = process.env.NEXT_PUBLIC_ADMIN_WEBID;
        if (value === undefined) {
            throw new Error(`${errorTemplate}NEXT_PUBLIC_ADMIN_WEBID`);
        }

        return value;
    }
}
