# solid-app-catalog

Minimal next.js app with LDO.

See home page for demo:
https://github.com/matthieubosquet/solid-app-catalog/blob/7018ac5afd3f7cfabb47e3d7434777450bb3dfd6/src/app/page.tsx#L27-L31

## How to

1. Run `npm start`
    - Starts LDO watching for changes to *.shex to regenerate Data Objects
    - Starts next in dev mode watching for changes to *.ts
    - Starts a Community Solid Server instance with scaffolded pod
        - Login: http://localhost:3001/.account/login/password/
            - email: a@a.a
            - password: a;
        - Pod: http://localhost:3001/a/
