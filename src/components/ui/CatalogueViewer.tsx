import type { SolidApp, SolidApps } from "@/ldo/Model.typings";

/**
 * This is a React component for displaying a catalogue of Solid applications.
 * It is used both on the (server-rendered, public) homepage, and in the (client-rendered, authenticated) admin page.
 */
export function CatalogueViewer({
    data,
    deleteHandler,
}: CatalogueViewerProps): React.ReactNode {
    // TODO: describe
    const render = (app: SolidApp) => renderApp(app, deleteHandler);

    // TODO: describe why app is nullable
    const apps = data.app?.map(render);

    // TODO: describe
    return <ul>{apps}</ul>;
}

function renderApp(app: SolidApp, deleteHandler?: AppHandler): React.ReactNode {
    // TODO: Describe why these are nullable
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
        // TODO: Assume website is unique
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

/**
 * This structure defines the shape of the properties passed to the catalogue viewer component.
 */
type CatalogueViewerProps = Readonly<{
    data: SolidApps;
    deleteHandler?: AppHandler;
}>;

/**
 * This structure defines the shape of an event handler (callback) for processing a {@link SolidApp}.
 * Used here for the "remove" button in the admin interface.
 */
type AppHandler = (app: SolidApp) => Promise<void>;
