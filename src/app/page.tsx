import Image from "next/image";
import styles from "./page.module.css";

import {
  parseRdf,
  startTransaction,
  toSparqlUpdate,
  toTurtle,
  set,
} from "@ldo/ldo";
import { FoafProfileShapeType } from "../ldo/foafProfile.shapeTypes";

export default async function Home() {
  const rawTurtle = `
  <#me> a <http://xmlns.com/foaf/0.1/Person>;
      <http://xmlns.com/foaf/0.1/name> "Jane Doe".
  `;

  const ldoDataset = await parseRdf(rawTurtle, {
    baseIRI: "https://solidweb.me/jane_doe/profile/card",
  });
  const janeProfile = ldoDataset
    // Tells the LDO dataset that we're looking for a FoafProfile
    .usingType(FoafProfileShapeType)
    // Says the subject of the FoafProfile
    .fromSubject("https://solidweb.me/jane_doe/profile/card#me");

  return (
    <div>
      <div>this is an LDO demo: {janeProfile.name}</div>
      <div><a href="solidFetch">click here for a fetch demo</a></div>
      <div><a href="solidFetchServerLdo">click here for a server fetch ldo demo (requires CSS running)</a></div>
      <div><a href="mutate">server fetch ldo put (requires CSS running)</a></div>
    </div>
  );
}
