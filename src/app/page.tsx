import { parseRdf } from "@ldo/ldo"
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes"
import { Config } from "@/Config"

export default async function Home() {
  const catalogueResponse = await fetch(Config.manifestResourceUri)
  const catalogueRdf = await catalogueResponse.text()
  const catalogueDataset = await parseRdf(catalogueRdf)
  const catalogue = catalogueDataset
    .usingType(SolidAppsShapeType)
    .fromSubject("urn:example:solid-apps")

  return (
    <ul>
      {catalogue.app?.map(app =>
        <li key={app.website!["@id"]}>
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
              <dd><input type="checkbox" checked={app.featured} disabled></input></dd>
            </div>
            <div>
              <dt>website</dt>
              <dd><a href={app.website!["@id"]}>{app.website!["@id"]}</a></dd>
            </div>
            <div>
              <dt>thumbnail</dt>
              {/* TODO: remove style */}
              <dd><img src={app.thumbnail!["@id"]} style={{ maxWidth: 100, maxHeight: 100 }}></img></dd>
            </div>
          </dl>
        </li>
      )}
    </ul>
  )
}
