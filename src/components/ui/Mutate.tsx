'use client'

import { parseRdf, toTurtle } from "@ldo/ldo"
import { login, getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser"
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes"
import { SolidApps, SolidApp } from "@/ldo/Model.typings"

const resourceUri = "http://localhost:3001/mutate/resource.ttl"
const appsUri = "urn:example:solid-apps"

export default function Mutate() {
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newFeatured, setNewFeatured] = useState(false)
  const [newWebsite, setNewWebsite] = useState("")
  const [apps, setApps] = useState<SolidApps>()
  const [, setMagic] = useState("")

  async function authenticate() {
    await handleIncomingRedirect()
    const session = getDefaultSession()

    if (!session.info.isLoggedIn) {
      console.log("unauthenticated")

      await login({
        oidcIssuer: "https://login.inrupt.com",
        redirectUrl: new URL("", window.location.href).toString(),
        clientName: "My application"
      })
    }
  }

  async function getDataInitial() {
    const response = await fetch(resourceUri)
    const text = await response.text()
    const dataset = await parseRdf(text)
    const solidApps = dataset.usingType(SolidAppsShapeType).fromSubject(appsUri)

    setApps(solidApps)
  }

  async function save() {
    await getDefaultSession().fetch(
      resourceUri,
      {
        method: "put",
        headers: {
          "Content-Type": "text/turtle",
          "Link": "<http://www.w3.org/ns/ldp#RDFSource>; rel=\"type\"",
        },
        body: await toTurtle(apps!)
      })

    alert("saved")
  }

  function removeApp(app: SolidApp) {
    app.name = undefined
    app.description = undefined
    app.featured = undefined
    app.website = undefined
    apps!.app?.delete(app)

    setMagic(Math.random().toString())
  }

  function addApp(e: FormEvent) {
    e.preventDefault()

    apps!.app?.add({
      name: newName,
      description: newDescription,
      featured: newFeatured,
      website: { "@id": newWebsite }
    })

    setNewName("")
    setNewDescription("")
    setNewFeatured(false)
    setNewWebsite("")
  }

  useEffect(() => {
    authenticate()
      .then(getDataInitial)
  }, [])

  return (
    <div>
      {apps &&
        <div>

          <ul>
            {apps.app?.map(app =>
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
                </dl>
                <button onClick={() => removeApp(app)}>remove</button>
              </li>)
            }
          </ul>

          <form onSubmit={addApp}>
            <fieldset>
              <legend>new app</legend>
              <div>
                <label>
                  <span>name</span>
                  <input required value={newName} onChange={e => setNewName(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  <span>description</span>
                  <input required value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  <span>featured</span>
                  <input type="checkbox" checked={newFeatured} onChange={e => setNewFeatured(e.target.checked)} />
                </label>
              </div>
              <div>
                <label>
                  <span>website</span>
                  <input required type="url" value={newWebsite} onChange={e => setNewWebsite(e.target.value)} />
                </label>
              </div>
              <button accessKey="a"><u>a</u>dd</button>
            </fieldset>
          </form>

          <button accessKey="s" onClick={save}><u>s</u>ave</button>

        </div>
      }
    </div>
  )
}
