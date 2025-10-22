const errorTemplate = "Could not find required environment variable: ";

/**
 * TODO: describe, also about env file, also other config sources
 */
export class Config {
    public static get baseUri(): string {
        const value = process.env.NEXT_PUBLIC_BASE_URI; // TODO: describe env var naming convention
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
}
