import { parseRdf } from "@ldo/ldo";
import { SolidAppsShapeType } from "./ldo/Model.shapeTypes";
import type { SolidApps } from "./ldo/Model.typings";
import { Config } from "./Config";

/**
 * TODO: Description
 */
export async function fetchCatalogue(): Promise<SolidApps> {
    // Construct a URL for the Solid resource.
    // Use a base URI (like http://example.com/some-path/) separate from the
    // local part (like file.ext)
    const uri = new URL(Config.manifestResourceUri, Config.baseUri);

    // TODO: explain formats, link to ldo docs, n3 docs
    const response = await fetch(uri, {
        headers: {
            Accept: "text/turtle, application/trig, application/n-triples, application/n-quads, text/n3",
        },
    });

    // TODO: describe serious error handling
    if (!response.ok) {
        throw new Error("Failed to fetch catalogue");
    }

    const rdf = await response.text();

    // TODO: describe why baseuri
    const options = { baseIRI: Config.baseUri };

    // TODO: describe ldo
    const dataset = await parseRdf(rdf, options);

    return dataset
        .usingType(SolidAppsShapeType)
        .fromSubject("urn:example:solid-apps");
}
