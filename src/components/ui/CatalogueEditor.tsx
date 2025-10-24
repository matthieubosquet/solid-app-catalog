"use client";

import type { FormEvent } from "react";
import { toTurtle } from "@ldo/ldo";
import {
    login,
    getDefaultSession,
    handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";
import { SolidApps, SolidApp } from "../../ldo/Model.typings";
import { Config } from "../../Config";
import { CatalogueViewer } from "../../components/ui/CatalogueViewer";
import { fetchCatalogue } from "../../fetchCatalogue";

export function CatalogueEditor() {
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newFeatured, setNewFeatured] = useState(false);
    const [newWebsite, setNewWebsite] = useState("");
    const [newThumbnail, setNewThumbnail] = useState<File>();
    const [catalogue, setCatalogue] = useState<SolidApps>();
    const [, setMagic] = useState("");

    useEffect(() => {
        authenticate().then(fetchCatalogue).then(setCatalogue);
    }, []);

    if (catalogue) {
        return (
            <>
                <CatalogueViewer data={catalogue} deleteHandler={removeApp} />

                <form onSubmit={addApp}>
                    <fieldset>
                        <legend>new app</legend>
                        <div>
                            <label>
                                <span>name</span>
                                <input
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>description</span>
                                <input
                                    required
                                    value={newDescription}
                                    onChange={(e) =>
                                        setNewDescription(e.target.value)
                                    }
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>featured</span>
                                <input
                                    type="checkbox"
                                    checked={newFeatured}
                                    onChange={(e) =>
                                        setNewFeatured(e.target.checked)
                                    }
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>website</span>
                                <input
                                    required
                                    type="url"
                                    value={newWebsite}
                                    onChange={(e) =>
                                        setNewWebsite(e.target.value)
                                    }
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <span>thumbnail</span>
                                <input
                                    required
                                    type="file"
                                    onChange={(e) =>
                                        setNewThumbnail(
                                            e.target.files
                                                ? e.target.files[0]
                                                : undefined
                                        )
                                    }
                                />
                            </label>
                        </div>
                        <button accessKey="a">
                            <u>a</u>dd
                        </button>
                    </fieldset>
                </form>
            </>
        );
    } else {
        return (
            <>
                <p>Could not load catalogue.</p>
                <p>Manifest resource probably does not exist.</p>
                <p>
                    Did you run the <a href="boot">bootstrap page</a>?
                </p>
            </>
        );
    }

    async function authenticate() {
        await handleIncomingRedirect();
        const session = getDefaultSession();

        if (!session.info.isLoggedIn) {
            console.log("unauthenticated");

            await login({
                oidcIssuer: "https://login.inrupt.com", // TODO: config
                clientName: "My application",
            });
        }
    }

    async function save() {
        if (!catalogue) {
            throw new Error("Catalogue state variable was not set");
        }

        const uri = new URL(Config.manifestResourceUri, Config.baseUri);
        const response = await getDefaultSession().fetch(uri, {
            method: "put",
            headers: {
                "Content-Type": "text/turtle",
                Link: '<http://www.w3.org/ns/ldp#RDFSource>; rel="type"',
            },
            body: await toTurtle(catalogue),
        });

        if (!response.ok) {
            throw new Error("Could not save catalogue manifest resource");
        }

        alert("Catalogue manifest resource saved");
    }

    async function removeApp(app: SolidApp) {
        if (!app.thumbnail) {
            throw new Error("thumbnail is required");
        }

        // TODO: Why separate? Explain dependent resource
        await deleteThumbnail(app.thumbnail["@id"]);

        delete app.name;
        delete app.description;
        delete app.featured;
        delete app.website;
        delete app.thumbnail;

        // TODO: Why separate? Explain graph deletion of complex value
        catalogue?.app?.delete(app);

        save();

        // TODO: justify
        setMagic(Math.random().toString());
    }

    async function addApp(e: FormEvent) {
        e.preventDefault();

        catalogue?.app?.add({
            name: newName,
            description: newDescription,
            featured: newFeatured,
            website: { "@id": newWebsite },
            thumbnail: { "@id": await createNewThumbnail() },
        });

        setNewName("");
        setNewDescription("");
        setNewFeatured(false);
        setNewWebsite("");
        // TODO: How to reset new thumbnail input?

        save();
    }

    async function createNewThumbnail(): Promise<string> {
        const response = await getDefaultSession().fetch(Config.baseUri, {
            method: "post",
            headers: {
                "Content-Type":
                    newThumbnail?.type ?? "application/octet-stream",
            },
            body: newThumbnail,
        });

        if (!response.ok) {
            throw new Error("Could not create new thumbnail resource");
        }

        const location = response.headers.get("Location");
        if (!location) {
            throw new Error("Thumbnail create response lacks location header");
        }

        return location;
    }

    async function deleteThumbnail(thumbnail: string) {
        await getDefaultSession().fetch(thumbnail, { method: "delete" });
    }
}
