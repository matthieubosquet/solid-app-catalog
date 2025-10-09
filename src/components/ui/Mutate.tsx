'use client'

import { parseRdf, toTurtle, } from "@ldo/ldo";
import { login, getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser"
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ModelShapeType } from "../../ldo/Model.shapeTypes"
import { Model, Child } from "@/ldo/Model.typings";

const resourceUri = "http://localhost:3001/mutate/resource.ttl"

export default function Mutate() {
  const [newP1, setNewP1] = useState("")
  const [newP2, setNewP2] = useState("")
  const [ldo, setLdo] = useState<Model>()
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

  function removeChild(child: Child) {
    child.p1 = undefined
    child.p2 = undefined
    ldo!.child?.delete(child)

    setMagic(Math.random().toString())
  }

  function addChild(e: FormEvent) {
    e.preventDefault()

    ldo!.child?.add({
      p1: newP1,
      p2: newP2
    })

    setNewP1("")
    setNewP2("")
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
            {ldo.child?.map(c =>
              <li key={c["@id"]}>
                <dl>
                  <dt>p1</dt><dd>{c.p1}</dd>
                  <dt>p2</dt><dd>{c.p2}</dd>
                </dl>
                <button onClick={() => removeChild(c)}>remove</button>
              </li>)
            }
          </ul>

          <form onSubmit={addChild}>
            <fieldset>
              <legend>new child</legend>
              <div>
                <label>
                  <span>p1</span>
                  <input required value={newP1} onChange={e => setNewP1(e.target.value)} />
                </label>
              </div>
              <div>
                <label>
                  <span>p2</span>
                  <input required value={newP2} onChange={e => setNewP2(e.target.value)} />
                </label>
              </div>
              <button>add</button>
            </fieldset>
          </form>

          <button accessKey="s" onClick={onClick}><u>s</u>ave</button>

        </div>
      }
    </div>



  )
}
