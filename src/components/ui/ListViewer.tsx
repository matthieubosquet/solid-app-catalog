import type { Item, List } from "../../ldo/Model.typings";
import style from "../../styles/ListEditorStyle.module.css";

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
    return <ul className={style.list}>{items}</ul>;
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
        <li key={website} className={style.list_item}>
            <dl className={style.item_details}>
                <div className={style.detail_row}>
                    <dt>name</dt>
                    <dd>{item.name}</dd>
                </div>
                <div className={style.detail_row}>
                    <dt>description</dt>
                    <dd>{item.description}</dd>
                </div>
                <div className={style.detail_row}>
                    <dt>featured</dt>
                    <dd>
                        <input
                            type="checkbox"
                            checked={item.featured}
                            disabled
                            aria-label="Featured item"
                        />
                    </dd>
                </div>
                <div className={style.detail_row}>
                    <dt>website</dt>
                    <dd>
                        <a href={website} className={style.link}>{website}</a>
                    </dd>
                </div>
                <div className={style.detail_row}>
                    <dt>thumbnail</dt>
                    <dd>
                        <img src={thumbnail} alt={`Thumbnail for ${item.name || 'item'}`} className={style.thumbnail} />
                    </dd>
                </div>
            </dl>
            {deleteHandler && (
                <button
                    onClick={() => deleteHandler(item)}
                    className={style.remove_button}
                    aria-label={`Remove ${item.name || 'item'}`}
                >
                    remove
                </button>
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
