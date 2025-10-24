import { Config } from "../../Config";
import { getResourceInfoWithAcl } from "@inrupt/solid-client";
import { getLinkedAcrUrl } from "@inrupt/solid-client/acp/acp";

export const dynamic = "force-dynamic";

/**
 * This is the boot page.
 * It is available (by default) at http://localhost:3000/boot
 */
export default async function () {
    try {
        await createManifetsResource();
        await updateContainerAccessControl();

        return (
            <>
                <p>
                    Created manifest resource and modified container access
                    control.
                </p>
                <p>
                    Try editing the manifest resource on the{" "}
                    <a href="admin">admin page</a>
                </p>
            </>
        );
    } catch {
        return "Could not create manifest resource / modify container access control.";
    }
}

async function createManifetsResource() {
    const uri = new URL(Config.manifestResourceUri, Config.baseUri);

    const response1 = await fetch(uri, {
        method: "put",
        headers: {
            "Content-Type": "text/turtle",
        },
    });

    if (!response1.ok) {
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

    if (!response.ok) {
        throw new Error("Could not modify container access control");
    }
}

const defaultAcrAcpRdf = `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
PREFIX : <http://www.w3.org/ns/solid/acp#>

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

_:me :agent <${Config.adminWebID}> . # TODO: Replace with proper WebID
`;
