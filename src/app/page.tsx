import { ListViewer } from "../components/ui/ListViewer";
import { fetchList } from "../fetchList";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

/**
 * This is the home page.
 * It is available (by default) at http://localhost:3000/
 */
export default async function () {
    try {
        return (
            <div className={styles.container}>
                <h1 className={styles.page_title}>
                    List Items
                </h1>
                <ListViewer data={await fetchList()} />
            </div>
        );
    } catch {
        return (
            <div className={styles.error_container}>
                <h1 className={styles.error_title}>
                    Could not load list
                </h1>
                <p className={styles.error_text}>Manifest resource probably does not exist.</p>
                <p>
                    Did you run the <a href="boot">bootstrap page</a>?
                </p>
            </div>
        );
    }
}
