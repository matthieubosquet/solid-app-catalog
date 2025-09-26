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
      {janeProfile.name}
    </div>
  );
}
