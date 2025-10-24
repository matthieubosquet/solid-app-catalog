import { CatalogueViewer } from "../components/ui/CatalogueViewer";
import { fetchCatalogue } from "../fetchCatalogue";

export const dynamic = "force-dynamic";

/**
 * This is the home page.
 * It is available (by default) at http://localhost:3000/
 */
export default async function () {
    try {
        return <CatalogueViewer data={await fetchCatalogue()} />;
    } catch {
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
}
