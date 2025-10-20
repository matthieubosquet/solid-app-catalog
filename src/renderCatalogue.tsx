import type { SolidApp, SolidApps } from "@/ldo/Model.typings";

// TODO: Make component
export function renderCatalogue(catalogue: SolidApps): React.ReactNode {
    return <ul>{catalogue.app?.map(renderApp)}</ul>;
}

function renderApp(app: SolidApp): React.ReactNode {
    if (!app.website) {
        throw new Error("website is required");
    }
    if (!app.thumbnail) {
        throw new Error("thumbnail is required");
    }

    // TODO: descripbe @id
    const website = app.website["@id"];
    const thumbnail = app.thumbnail["@id"];

    return (
        <li key={website}>
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
                    <dd>
                        <input
                            type="checkbox"
                            checked={app.featured}
                            disabled />
                    </dd>
                </div>
                <div>
                    <dt>website</dt>
                    <dd>
                        <a href={website}>{website}</a>
                    </dd>
                </div>
                <div>
                    <dt>thumbnail</dt>
                    <dd>
                        <img src={thumbnail} />
                    </dd>
                </div>
            </dl>
        </li>
    );
}
