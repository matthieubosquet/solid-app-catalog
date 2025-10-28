import { ListViewer } from "../components/ui/ListViewer";
import { fetchList } from "../fetchList";

export const dynamic = "force-dynamic";

/**
 * This is the home page.
 * It is available (by default) at http://localhost:3000/
 */
export default async function () {
    try {
        return <ListViewer data={await fetchList()} />;
    } catch {
        return (
            <>
                <p>Could not load list.</p>
                <p>Manifest resource probably does not exist.</p>
                <p>
                    Did you run the <a href="boot">bootstrap page</a>?
                </p>
            </>
        );
    }
}
