import { CatalogueViewer } from "@/components/ui/CatalogueViewer";
import { fetchCatalogue } from "@/fetchCatalogue";

export default async function () {
    return <CatalogueViewer data={await fetchCatalogue()} />;
}
