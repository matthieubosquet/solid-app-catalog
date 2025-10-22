import { CatalogueViewer } from "@/components/ui/CatalogueViewer";
import { fetchCatalogue } from "@/fetchCatalogue";

/**
 * This is the home page.
 * It is available (by default) at http://localhost:3000/
 */
export default async function () {
    return <CatalogueViewer data={await fetchCatalogue()} />;
}
