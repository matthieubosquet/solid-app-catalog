# Solid + Next.js + LDO: Demo Application

This is a minimal Solid Application using [Next.js](https://nextjs.org/) and [LDO](https://ldo.js.org/latest/).

This app is meant to help developers get started developing for Solid. The code is commented to help understand the development patterns.

## Prerequisite

Only the App admin can add List Items.

Therefore, you need a [WebID](https://solid.github.io/webid-profile/) to correctly boot the server.

A WebID is a URL you control and can use to sign in to Solid Apps.

### Creating a WebID

If you don't have a WebID, you can choose from the Pod Providers listed on https://solidproject.org/get_a_pod.

For example, you can signup for a WebID at https://start.inrupt.com/.

### Access Control in Solid

Solid has two languages to describe access to resources: [WAC](https://solidproject.org/TR/wac) and [ACP](https://solidproject.org/TR/acp). This project uses ACP.

By default, the local Solid server will be open to everyone, as described in `.data/.acr`.

The boot page in the Next App sets the app admin using an environment variable.

You can change your app admin at any time by resetting `.data/.acr` (to make the local Solid server accessible to everyone); changing the `NEXT_PUBLIC_ADMIN_WEBID` environment variable and rerunning the boot process (go to `http://localhost:3000/boot`).


## Setting Environment Variables

This project includes a `.env.example` file with the placeholders for environment variables used by the app:
- `NEXT_PUBLIC_BASE_URI` - Base URI for the Solid server
- `NEXT_PUBLIC_MANIFEST_RESOURCE_URI` - URI for the manifest resource
- `NEXT_PUBLIC_ADMIN_WEBID` - WebID of the admin user
- `NEXT_PUBLIC_OIDC_ISSUER` - OIDC issuer URL for authentication (e.g., `https://login.inrupt.com`)

Before running the app:
1. Copy paste `.env.example` to `.env`;
1. Set the `NEXT_PUBLIC_ADMIN_WEBID` and `NEXT_PUBLIC_OIDC_ISSUER` environment variables.

Note: `.env` and `.env.local` are ignored by git (see `.gitignore`).


## Run the App

The app can be run locally using npm commands: `install`, `build` and `start:dev`.

The `start:dev` command concurrently runs the [Community Solid Server](https://communitysolidserver.github.io/CommunitySolidServer/latest/), LDO in watch mode (to rebuild the model when changes are made), and Next in dev mode.

1. `npm i`
1. (Your environments variables must be set before running the build)
1. `npm run build`
1. `npm run start:dev`
    - Starts LDO watching for changes to *.shaclc to regenerate Data Objects
    - Starts next in dev mode watching for changes to *.ts 
        - Runs on http://localhost:3000
    - Starts a Community Solid Server instance
        - Runs on http://localhost:3001
        - Uses the `./data` directory for storing Solid Resources
        - Has a minimal config using [ACP](https://solidproject.org/TR/acp) for access control

Note: If you want to change the App Admin WebID, update the last line of `.data/.acr` or reset the file and re-run `npm run build` after setting the `NEXT_PUBLIC_ADMIN_WEBID` in `.env`.


## Architecture

Solid specifications include definitions for a [standard storage API](https://solidproject.org/TR/protocol), an [authentication mechanism](https://solidproject.org/TR/oidc) and an [access control language](https://solidproject.org/TR/acp).

We stir away from hierarchical modelling, resource containment is designed to enable adequate access control of resources to serve functionality.

Manifests resources are publicly readable resources designed for traversal needs.


## Acknowledgement

Thanks to imec and the SolidLab Flanders for [developing the CSS](https://solidlab.be/community-solid-server/).


## License

This work is dual-licensed under MIT and Apache 2.0.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: MIT OR Apache-2.0`
