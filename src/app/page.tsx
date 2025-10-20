import { parseRdf } from "@ldo/ldo";
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes";
import { Config } from "@/Config";

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

    return (
        <ul>
            {catalogue.app?.map((app) => {
                if (!app.website) {
                    throw new Error("website is required");
                }
                if (!app.thumbnail) {
                    throw new Error("thumbnail is required");
                }

                return (
                    <li key={app.website["@id"]}>
                        <dl>
                            <div>
                                <dt>name</dt>
                                <dd>{app.name}</dd>
                            </div>
                            <div>
                                <dt>description</dt>
                                <dd>{app.description}</dd>
                            </div>
                            <div>
                                <dt>featured</dt>
                                <dd>
                                    <input
                                        type="checkbox"
                                        checked={app.featured}
                                        disabled
                                    />
                                </dd>
                            </div>
                            <div>
                                <dt>website</dt>
                                <dd>
                                    <a href={app.website["@id"]}>
                                        {app.website["@id"]}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>thumbnail</dt>
                                <dd>
                                    {/* TODO: remove style */}
                                    <img
                                        src={app.thumbnail["@id"]}
                                        style={{
                                            maxWidth: 100,
                                            maxHeight: 100,
                                        }}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </li>
                );
            })}
        </ul>
    );
}
