import { CatalogueEditor } from "../../components/ui/CatalogueEditor";

/**
 * This is the admin page.
 * It is available (by default) at http://localhost:3000/admin
 * It is used to create and delete catalogue items.
 * Actual functionality is in the CatalogueEditor component.
 */
export default function () {
    return <CatalogueEditor />;
}
