import { parseRdf } from "@ldo/ldo";
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes";
import type { SolidApps } from "@/ldo/Model.typings";
import { Config } from "@/Config";
import { Catalogue } from "@/components/ui/Catalogue";

export default async function Home() {
    return <Catalogue data={await fetchCatalogue()} />;
}

async function fetchCatalogue(): Promise<SolidApps> {
    const uri = new URL(Config.manifestResourceUri, Config.baseUri);
    const response = await fetch(uri);
    const rdf = await response.text();
    const options = {
        baseIRI: Config.baseUri,
    };
    const dataset = await parseRdf(rdf, options);

    return dataset
        .usingType(SolidAppsShapeType)
        .fromSubject("urn:example:solid-apps"); // TODO: Config
}
