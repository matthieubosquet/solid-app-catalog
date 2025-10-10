import { parseRdf } from "@ldo/ldo"
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes"

const resourceUri = "http://localhost:3001/mutate/resource.ttl" // TODO: Extract

export default async function Home() {
  var catalogueResponse = await fetch(resourceUri)
  var catalogueRdf = await catalogueResponse.text()
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
