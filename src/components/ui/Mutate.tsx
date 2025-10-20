"use client";

import type { FormEvent } from "react";
import { parseRdf, toTurtle } from "@ldo/ldo";
import {
    login,
    getDefaultSession,
    handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";
import { SolidAppsShapeType } from "@/ldo/Model.shapeTypes";
import { SolidApps, SolidApp } from "@/ldo/Model.typings";
import { Config } from "@/Config";
import { renderCatalogue } from "@/renderCatalogue";

const appsUri = "urn:example:solid-apps";

export default function Mutate() {
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newFeatured, setNewFeatured] = useState(false);
    const [newWebsite, setNewWebsite] = useState("");
    const [newThumbnail, setNewThumbnail] = useState<File>();
    const [apps, setApps] = useState<SolidApps>();
    const [, setMagic] = useState("");

    async function authenticate() {
        await handleIncomingRedirect();
        const session = getDefaultSession();

        if (!session.info.isLoggedIn) {
            console.log("unauthenticated");

            await login({
                oidcIssuer: "https://login.inrupt.com", // TODO:
                redirectUrl: new URL("", window.location.href).toString(),
                clientName: "My application",
            });
        }
    }

    async function getDataInitial() {
        const catalogueManifestUri = new URL(
            Config.manifestResourceUri,
            Config.baseUri
        );
        const response = await fetch(catalogueManifestUri);
        const text = await response.text();
        const dataset = await parseRdf(text, { baseIRI: Config.baseUri }); // TODO: Comment about baseuri
        const solidApps = dataset
            .usingType(SolidAppsShapeType)
            .fromSubject(appsUri);

        setApps(solidApps);
    }

    async function save() {
        await getDefaultSession().fetch(Config.manifestResourceUri, {
            method: "put",
            headers: {
                "Content-Type": "text/turtle",
                Link: '<http://www.w3.org/ns/ldp#RDFSource>; rel="type"',
            },
            body: await toTurtle(apps!),
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

        apps?.app?.delete(app);

        save();

        setMagic(Math.random().toString());
    }

    async function addApp(e: FormEvent) {
        e.preventDefault();

        apps?.app?.add({
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

    async function deleteThumbnail(thumbnail: string): Promise<void> {
        await getDefaultSession().fetch(thumbnail, { method: "delete" });
    }

    useEffect(() => {
        authenticate().then(getDataInitial);
    }, []);

    return (
        <div>
            {apps && (
                <div>
                    {renderCatalogue(apps)}

                    <form onSubmit={addApp}>
                        <fieldset>
                            <legend>new app</legend>
                            <div>
                                <label>
                                    <span>name</span>
                                    <input
                                        required
                                        value={newName}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
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
                </div>
            )}
        </div>
    );
}
