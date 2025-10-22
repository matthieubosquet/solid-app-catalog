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

    return (
        catalogue && (
            <>
                <CatalogueViewer data={catalogue} deleteHandler={removeApp} />
                <NewCatalogueForm />
            </>
        )
    );

    async function authenticate() {
        await handleIncomingRedirect();
        const session = getDefaultSession();

        if (!session.info.isLoggedIn) {
            console.log("unauthenticated");

            await login({
                oidcIssuer: "https://login.inrupt.com", // TODO: config
                redirectUrl: new URL("", window.location.href).toString(),
                clientName: "My application",
            });
        }
    }

    async function save() {
        const uri = new URL(Config.manifestResourceUri, Config.baseUri);
        await getDefaultSession().fetch(uri, {
            method: "put",
            headers: {
                "Content-Type": "text/turtle",
                Link: '<http://www.w3.org/ns/ldp#RDFSource>; rel="type"',
            },
            body: await toTurtle(catalogue!),
        });

        alert("saved");
    }

    async function removeApp(app: SolidApp) {
        if (!app.thumbnail) {
            throw new Error("thumbnail is required");
        }

        await deleteThumbnail(app.thumbnail["@id"]);

        delete app.name;
        delete app.description;
        delete app.featured;
        delete app.website;
        delete app.thumbnail;

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

    async function createNewThumbnail() {
        const thumbnailUploadResponse = await getDefaultSession().fetch(
            Config.baseUri,
            {
                method: "post",
                headers: {
                    "Content-Type":
                        newThumbnail?.type ?? "application/octet-stream",
                },
                body: newThumbnail,
            }
        );

        return thumbnailUploadResponse.headers.get("Location")!; // TODO: handle failed response
    }

    async function deleteThumbnail(thumbnail: string) {
        await getDefaultSession().fetch(thumbnail, { method: "delete" });
    }

    function NewCatalogueForm() {
        return (
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
                                onChange={(e) => setNewWebsite(e.target.value)}
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
        );
    }
}
