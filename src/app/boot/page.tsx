import { Config } from "../../Config";
import { getResourceInfoWithAcl } from "@inrupt/solid-client";
import { getLinkedAcrUrl } from "@inrupt/solid-client/acp/acp";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

/**
 * This is the boot page.
 * It is available (by default) at http://localhost:3000/boot
 * It is used to create the list manifest Solid resource and to configure the access control policy for the Solid container where this application stores its data.
 * It is intended to be called once only after deploying the Solid server.
 * 'Provisioning' functionality similar to this is likely to be needed in a production setup,
 * but it might not be needed in every deployment.
 */
export default async function () {
    try {
        await createManifetsResource();
        await updateContainerAccessControl();

        return (
            <div className={styles.message_container}>
                <h1 className={styles.success_title}>
                    Bootstrap successful
                </h1>
                <p className={styles.message_text}>
                    Created manifest resource and modified container access
                    control.
                </p>
                <p>
                    Try editing the manifest resource on the{" "}
                    <a href="admin">admin page</a>
                </p>
            </div>
        );
    } catch {
        return (
            <div className={styles.message_container}>
                <h1 className={styles.error_title}>
                    Bootstrap failed
                </h1>
                <p className={styles.message_text}>Could not create manifest resource / modify container access control.</p>
            </div>
        );
    }
}

/**
 * Creates the manifest Solid resource used by this application.
 * Assumes that the resource is publically writable.
 */
async function createManifetsResource() {
    // This is the address of the manifest resource to create.
    // In a production environment there could be a name clash.
    // An alternative approach could be to generate a unique name for the resource,
    // or to use a POST request to the container instead. This would generate a unique resource name
    // that would be returned in the Location header of the response.
    const uri = new URL(Config.manifestResourceUri, Config.baseUri);

    // Send an unauthenticated PUT request to create the manifest resource.
    // It is unlikely that unauthenticated requests are allowed in a production environment,
    // so one would need to authenticate first and use the appropriate authentication headers here,
    // for example using the @inrupt/solid-client-authn-browser or @inrupt/solid-client-authn-node libraries.
    // Alternatively, the resource could be created manually or by an automated process outside of this application.
    const response = await fetch(uri, {
        method: "put",
        headers: {
            // Solid required a content-type header for requests that change resources, even ones that do not have a body, like ours.
            // See https://solidproject.org/TR/protocol#client-content-type-includes
            // Solid guarantees support for Turtle and JSON-LD, but other RDF serializations may also be supported by some servers.
            "Content-Type": "text/turtle",
        },
    });

    // Robust network resilience and error handling are out of scope for this simple example.
    if (!response.ok) {
        throw new Error("Could not create manifest resource");
    }
}

async function updateContainerAccessControl() {
    const appContainer = await getResourceInfoWithAcl(Config.baseUri);
    const acrUri = getLinkedAcrUrl(appContainer);
    if (!acrUri) {
        throw new Error("Could not find container access control resource");
    }

    const response = await fetch(acrUri, {
        method: "put",
        body: defaultAcrAcpRdf,
        headers: {
            "Content-Type": "text/turtle",
        },
    });

    // Robust network resilience and error handling are out of scope for this simple example.
    if (!response.ok) {
        throw new Error("Could not modify container access control");
    }
}

const defaultAcrAcpRdf = `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
PREFIX : <http://www.w3.org/ns/solid/acp#>

# This gives full access to everyone but denies Write and control for anyone but the admin
[
    :resource <.> ;
    :accessControl [
        :apply _:public ;
        :apply [
            :deny acl:Write, acl:Control ;
            :noneOf _:me ;
        ] ;
    ] ;
    :memberAccessControl [
        :apply _:public ;
        :apply [
            :deny acl:Write ;
            :noneOf _:me ;
        ] ;
    ] ;
] .

_:public
    :allow acl:Read, acl:Write, acl:Control ;
    :anyOf [
        :agent :PublicAgent ;
    ] ;
.

# TODO: describe, also describe robust policy design
_:me :agent <${Config.adminWebID}> .
`;
