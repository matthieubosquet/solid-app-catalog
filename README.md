# Solid + Next.js + LDO: Demo Application

This is a minimal Solid Application using [Next.js](https://nextjs.org/), [LDO](https://ldo.js.org/latest/) and [ACP](https://solidproject.org/TR/acp).

## Prerequisite

Only the App admin can add List Items.

Therefore, you need a [WebID](https://solid.github.io/webid-profile/) to correctly boot the server.

A WebID is a URL you control and can use to sign in to Solid Apps.

Before running the app, set the `NEXT_PUBLIC_ADMIN_WEBID` environment variable in .env.local.

### Creating a WebID

If you don't have a WebID, you can choose from the Pod Providers listed on https://solidproject.org/get_a_pod.

For example, you can signup for a WebID at https://start.inrupt.com/.


## Run the App

To run the app locally, just use npm commands: `install`, `build` and `start:dev`.

The `start:dev` command concurrently the [Community Solid Server](https://communitysolidserver.github.io/CommunitySolidServer/latest/), LDO in watch mode (to rebuild the model when changes are made), and Next in dev mode.

1. `npm i`
1. `npm run build`
1. `npm run start:dev`
    - Starts LDO watching for changes to *.shaclc to regenerate Data Objects
    - Starts next in dev mode watching for changes to *.ts 
        - Runs on http://localhost:3000
    - Starts a Community Solid Server instance
        - Runs on http://localhost:3001
        - Uses the `./data` directory for storing Solid Resources
        - Has a minimal config using [ACP](https://solidproject.org/TR/acp) for access control



## Architecture

Solid specifications include definitions for a [standard storage API](https://solidproject.org/TR/protocol), an [authentication mechanism](https://solidproject.org/TR/oidc) and an [access control language](https://solidproject.org/TR/acp).

We stir away from hierarchical modelling, resource containment is designed to enable adequate access control of resources to serve functionality.

Manifests resources are publicly readable resources designed for traversal needs.


## 
