import type { Item, List } from "../../ldo/Model.typings";

/**
 * This is a React component for displaying a list of items.
 * It is used both on the (server-rendered, public) homepage, and in the (client-rendered, authenticated) admin page.
 */
export function ListViewer({
    data,
    deleteHandler,
}: ListViewerProps): React.ReactNode {
    // TODO: describe
    const render = (item: Item) => renderItem(item, deleteHandler);

    // TODO: describe why item is nullable
    const items = data.item?.map(render);

    // TODO: describe
    return <ul>{items}</ul>;
}

function renderItem(item: Item, deleteHandler?: ItemHandler): React.ReactNode {
    // TODO: Describe why these are nullable
    if (!item.website) {
        throw new Error("website is required");
    }
    if (!item.thumbnail) {
        throw new Error("thumbnail is required");
    }

    // TODO: descripbe @id
    const website = item.website["@id"];
    const thumbnail = item.thumbnail["@id"];

    return (
        // TODO: Assume website is unique
        <li key={website}>
            <dl>
                <div>
                    <dt>name</dt>
                    <dd>{item.name}</dd>
                </div>
                <div>
                    <dt>description</dt>
                    <dd>{item.description}</dd>
                </div>
                <div>
                    <dt>featured</dt>
                    <dd>
                        <input
                            type="checkbox"
                            checked={item.featured}
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
                <button onClick={() => deleteHandler(item)}>remove</button>
            )}
        </li>
    );
}

/**
 * This structure defines the shape of the properties passed to the list viewer component.
 */
type ListViewerProps = Readonly<{
    data: List;
    deleteHandler?: ItemHandler;
}>;

/**
 * This structure defines the shape of an event handler (callback) for processing a {@link Item}.
 * Used here for the "remove" button in the admin interface.
 */
type ItemHandler = (item: Item) => Promise<void>;
