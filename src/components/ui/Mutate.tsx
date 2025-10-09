'use client'

import { parseRdf, toTurtle, } from "@ldo/ldo";
import { login, getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser"
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ModelShapeType } from "../../ldo/Model.shapeTypes"
import { Model } from "@/ldo/Model.typings";

const resourceUri = "http://localhost:3001/mutate/resource.ttl"

export default function Mutate() {
  const [newName, setNewName] = useState("")
  const [ldo, setLdo] = useState<Model>()
  const [magic, setMagic] = useState("")

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
    const ldo = dataset.usingType(ModelShapeType).fromSubject("http://example.com/a")

    setLdo(ldo)
  }

  async function onClick() {
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

    alert("saved")
  }
  function removeName(n: string) {
    ldo!.name?.delete(n)

    setMagic(Math.random().toString())
  }

  function addName(e: FormEvent) {
    e.preventDefault()

    ldo!.name?.add(newName)

    setNewName("")
  }

  useEffect(() => {
    authenticate()
      .then(getDataInitial)
  }, [])

  return (
    <div>
      {ldo &&
        <div>

          <ul>
            {ldo.name?.map(n =>
              <li key={n}>
                <span>name: {n}</span>
                <button onClick={() => removeName(n)}>remove</button>
              </li>)
            }
          </ul>

          <form onSubmit={addName}>
            <fieldset>
              <legend>new name</legend>
              <label>
                <span><u>n</u>ame</span>
                <input accessKey="n" required value={newName} onChange={e => setNewName(e.target.value)} />
              </label>
              <button>add</button>
            </fieldset>
          </form>

          <button accessKey="s" onClick={onClick}><u>s</u>ave</button>

        </div>
      }
    </div>



  )
}
