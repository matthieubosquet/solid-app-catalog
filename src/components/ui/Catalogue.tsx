import type { SolidApp, SolidApps } from "@/ldo/Model.typings";

type AppHandler = (app: SolidApp) => Promise<void>;

interface Props {
    data: SolidApps;
    deleteHandler?: AppHandler;
}

export function Catalogue({ data, deleteHandler }: Props) {
    return <ul>{data.app?.map((app) => renderApp(app, deleteHandler))}</ul>;
}

function renderApp(app: SolidApp, deleteHandler?: AppHandler): React.ReactNode {
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
                            disabled
                        />
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
            {deleteHandler && (
                <button onClick={() => deleteHandler(app)}>remove</button>
            )}
        </li>
    );
}
