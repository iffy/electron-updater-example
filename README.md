This repo contains the bare minimum code to have an auto-updating Electron app using [`electron-updater`](https://github.com/electron-userland/electron-builder/tree/master/packages/electron-updater) with releases stored on GitHub.

**NOTE:** If you want to run through this whole process, you will need to fork this repo on GitHub and replace all instances of `iffy` with your GitHub username before doing the following steps.

1. First, install necessary dependencies with:

        npm install

2. Generate a GitHub access token by going to <https://github.com/settings/tokens/new>.  The access token should have the `repo` scope/permission.  Once you have the token, assign it to an environment variable (on macOS/linux):

        export GH_TOKEN="<YOUR_TOKEN_HERE>"

3. Publish with the `publish.sh` script:

        ./publish.sh

4. Release the release on GitHub by going to <https://github.com/iffy/electron-updater-example/releases>, editing the release and clicking "Publish release."

5. Download and install the app from <https://github.com/iffy/electron-updater-example/releases>.

6. Update the version in `package.json`

7. Do steps 3 and 4 again.

8. Open the installed version of the app and see that it updates itself.