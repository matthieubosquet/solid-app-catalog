import { parseRdf } from "@ldo/ldo";
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes";
import { Config } from "@/Config";
import { renderCatalogue } from "@/renderCatalogue";

export default async function Home() {
    const catalogueManifestUri = new URL(
        Config.manifestResourceUri,
        Config.baseUri
    );
    const catalogueResponse = await fetch(catalogueManifestUri);
    const catalogueRdf = await catalogueResponse.text();
    const catalogueDataset = await parseRdf(catalogueRdf, {
        baseIRI: Config.baseUri,
    });
    const catalogue = catalogueDataset
        .usingType(SolidAppsShapeType)
        .fromSubject("urn:example:solid-apps");

    return renderCatalogue(catalogue);
}
