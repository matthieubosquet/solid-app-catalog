'use client'

import { parseRdf, toTurtle, } from "@ldo/ldo";
import { login, getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser"
import { useEffect, useState } from 'react'
import { FoafProfileShapeType } from "../../ldo/foafProfile.shapeTypes"
import { FoafProfile } from "@/ldo/foafProfile.typings";

const resourceUri="http://localhost:3001/mutate/resource.ttl"

export default function Mutate() {
  const [name, setName] = useState("")
  const [ldo, setLdo] = useState<FoafProfile>() // TODO: Initial value?

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
    const dataset = await parseRdf(text);
    const ldo = dataset.usingType(FoafProfileShapeType).fromSubject("http://example.com/a")

    setLdo(ldo)
    setName(ldo.name ?? "")
  }

  async function onClick() {
    (ldo as FoafProfile).name = name

    await getDefaultSession().fetch(
      resourceUri,
      {
        method: "put",
        headers: {
          "Content-Type": "text/turtle",
          "Link": "<http://www.w3.org/ns/ldp#RDFSource>; rel=\"type\"",
        },
        body: await toTurtle(ldo!)
      })
  }

  useEffect(() => {
    authenticate()
      .then(getDataInitial)
  }, [])

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)}></input>
      <button onClick={onClick}>save</button>
    </div>
  )
}
