import { parseRdf } from "@ldo/ldo";
import { FoafProfileShapeType } from "../../ldo/foafProfile.shapeTypes";
import styles from "./page.module.css";

export default async function Home() {
    var response = await fetch("http://localhost:3001/a/solidFetchServerLdoExample/manifest.ttl")
    var text = await response.text()

    const ldoDataset = await parseRdf(text);
    const profile = ldoDataset
        .usingType(FoafProfileShapeType)
        .fromSubject("http://example.org/a");

    return (
        <div className={styles.defaultClass}>
            <dl>
                <dt>@id</dt>
                <dd>{profile["@id"]}</dd>
                <dt>name</dt>
                <dd>{profile.name}</dd>
                <dt>img</dt>
                <dd>{profile.img}</dd>
                <dt>knows</dt>
                <dd>
                    <ul>{
                        profile.knows?.map(knownProfile =>
                            <li key={knownProfile["@id"]}>
                                <dl>
                                    <dt>name</dt>
                                    <dd>{knownProfile.name}</dd>
                                </dl>
                            </li>
                        )
                    }</ul>
                </dd>
            </dl>
        </div>
    );
}
