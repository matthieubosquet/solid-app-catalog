"use client";

import type { FormEvent } from "react";
import { toTurtle } from "@ldo/ldo";
import {
    login,
    getDefaultSession,
    handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";
import { List, Item } from "../../ldo/Model.typings";
import { Config } from "../../Config";
import { ListViewer } from "../../components/ui/ListViewer";
import { fetchList } from "../../fetchList";
import style from "../../styles/ListEditorStyle.module.css";

export function ListEditor() {
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newFeatured, setNewFeatured] = useState(false);
    const [newWebsite, setNewWebsite] = useState("");
    const [newThumbnail, setNewThumbnail] = useState<File>();
    const [list, setList] = useState<List>();
    const [, setMagic] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        authenticate().then(fetchList).then(setList);
    }, []);

    // Check if list is empty
    const isListEmpty = list ? (list.item ? Array.from(list.item).length === 0 : true) : false;

    useEffect(() => {
        // Show form by default if list is empty, and keep it open
        if (list && isListEmpty) {
            setIsFormOpen(true);
        }
    }, [list, isListEmpty]);

    if (list) {
        return (
            <main className={style.main_container}>
                <section className={style.header}>
                    <h1 className={style.title}>List Items</h1>
                    {!isListEmpty && (
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className={style.toggle_button}
                            aria-expanded={isFormOpen}
                            aria-label={isFormOpen ? "Close form" : "Add new item"}
                        >
                            {isFormOpen ? (
                                <>
                                    <span>−</span> Cancel
                                </>
                            ) : (
                                <>
                                    <span>+</span> Add New Item
                                </>
                            )}
                        </button>
                    )}
                </section>

                <div className={`${style.content_wrapper} ${(!isListEmpty && isFormOpen) ? style.content_wrapper_with_form : ''}`}>
                    {!isListEmpty && (
                        <section className={style.list_section}>
                            <ListViewer data={list} deleteHandler={removeItem} />
                        </section>
                    )}

                    {(isFormOpen || isListEmpty) && (
                        <form onSubmit={addItem} className={style.form_cont}>
                        <fieldset className={style.fieldset_cont}>
                            <legend className={style.form_legend}>New Item</legend>
                            <div>
                                <label>
                                    <span>Name</span>
                                    <input
                                        type="text"
                                        required
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Description</span>
                                    <input
                                        type="text"
                                        required
                                        value={newDescription}
                                        onChange={(e) =>
                                            setNewDescription(e.target.value)
                                        }
                                    />
                                </label>
                            </div>
                            <div>
                                <label className={style.checkbox_label}>
                                    <span>Featured</span>
                                    <input
                                        type="checkbox"
                                        checked={newFeatured}
                                        onChange={(e) =>
                                            setNewFeatured(e.target.checked)
                                        }
                                        aria-label="Featured item"
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Website</span>
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
                                    <span>Thumbnail</span>
                                    <input
                                        required
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setNewThumbnail(
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : undefined
                                            )
                                        }
                                        aria-label="Thumbnail image"
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                accessKey="a"
                                className={style.submit_button}
                            >
                                <u>A</u>dd Item
                            </button>
                        </fieldset>
                        </form>
                    )}
                </div>
            </main>
        );
    } else {
        return (
            <div className={style.error_container}>
                <h1 className={style.error_title}>
                    Could not load list
                </h1>
                <p className={style.error_text}>Manifest resource probably does not exist.</p>
                <p>
                    Did you run the <a href="boot">bootstrap page</a>?
                </p>
            </div>
        );
    }

    async function authenticate() {
        await handleIncomingRedirect();
        const session = getDefaultSession();

        if (!session.info.isLoggedIn) {
            console.log("unauthenticated");

            await login({
                oidcIssuer: Config.oidcIssuer,
                clientName: "My application",
            });
        }
    }

    async function save() {
        if (!list) {
            throw new Error("List state variable was not set");
        }

        const uri = new URL(Config.manifestResourceUri, Config.baseUri);
        const response = await getDefaultSession().fetch(uri, {
            method: "put",
            headers: {
                "Content-Type": "text/turtle",
                Link: '<http://www.w3.org/ns/ldp#RDFSource>; rel="type"',
            },
            body: await toTurtle(list),
        });

        if (!response.ok) {
            throw new Error("Could not save list manifest resource");
        }

        alert("List manifest resource saved");
    }

    async function removeItem(item: Item) {
        if (!item.thumbnail) {
            throw new Error("thumbnail is required");
        }

        // TODO: Why separate? Explain dependent resource
        await deleteThumbnail(item.thumbnail["@id"]);

        delete item.name;
        delete item.description;
        delete item.featured;
        delete item.website;
        delete item.thumbnail;

        // TODO: Why separate? Explain graph deletion of complex value
        list?.item?.delete(item);

        save();

        // TODO: justify
        setMagic(Math.random().toString());
    }

    async function addItem(e: FormEvent) {
        e.preventDefault();

        list?.item?.add({
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
        setNewThumbnail(undefined);
        setIsFormOpen(false);
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
