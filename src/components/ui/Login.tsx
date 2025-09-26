'use client'

import { login, getDefaultSession, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser'
import { useEffect, useState } from 'react';

export default function Login() {
  const [resourceUri, setResourceUri] = useState('');
  const [oidcIssuer, setOidcIssuer] = useState('');

  async function startLogin() {
    const session = getDefaultSession();

    if (session.info.isLoggedIn) {
      const response = await session.fetch(resourceUri)
      const text = await response.text()
      console.log(text)
    } else {
      await login({
        oidcIssuer,
        redirectUrl: new URL("", window.location.href).toString(),
        clientName: "My application"
      })
    }
  }

  useEffect(() => {
    handleIncomingRedirect()
  }, [])

  return (
    <div>
      <label>
        <span>OIDC issuer</span>
        <input value={oidcIssuer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOidcIssuer(e.target.value)}></input>
      </label>
      <label>
        <span>resource URI</span>
        <input value={resourceUri} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResourceUri(e.target.value)}></input>
      </label>
      <button onClick={startLogin}>1. populate oidc issuer and click here to login / 2. populate resource uri and click here to fetch</button>
    </div>
  )
}
