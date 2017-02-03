This repo contains the bare minimum code to have an auto-updating Electron app using [`electron-updater`](https://github.com/electron-userland/electron-builder/tree/master/packages/electron-updater) with releases stored on GitHub.

1. First, install necessary dependencies with:

        npm install

2. Generate a GitHub access token by going to <https://github.com/settings/tokens/new>.  The access token should have the `repo` scope/permission.  Once you have the token, assign it to an environment variable (on macOS/linux):

        export GH_TOKEN="<YOUR_TOKEN_HERE>"

3. Publish with the `publish.sh` script:

        ./publish.sh

4. Download and install the app from <https://github.com/iffy/electron-updater-example/releases>.

5. Update the version in `package.json`

6. Publish again.

7. Open the installed version of the app and see that it updates itself.