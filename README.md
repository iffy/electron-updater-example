This repo contains the **bare minimum code** to have an auto-updating Electron app using [`electron-updater`](https://github.com/electron-userland/electron-builder/tree/master/packages/electron-updater) with releases stored on GitHub.

**NOTE:** If you want to run through this whole process, you will need to fork this repo on GitHub and replace all instances of `iffy` with your GitHub username before doing the following steps.

1. For macOS, you will need a code-signing certificate.
    
    Install Xcode (from the App Store), then follow [these instructions](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW6) to make sure you have a "Mac Developer" certificate.  If you'd like to export the certificate (for automated building, for instance) [you can](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW7).  You would then follow [these instructions](https://github.com/electron-userland/electron-builder/wiki/Code-Signing).

2. First, install necessary dependencies with:

        npm install

3. Generate a GitHub access token by going to <https://github.com/settings/tokens/new>.  The access token should have the `repo` scope/permission.  Once you have the token, assign it to an environment variable (on macOS/linux):

        export GH_TOKEN="<YOUR_TOKEN_HERE>"

4. Publish with the `publish.sh` script:

        ./publish.sh

5. Release the release on GitHub by going to <https://github.com/iffy/electron-updater-example/releases>, editing the release and clicking "Publish release."

6. Download and install the app from <https://github.com/iffy/electron-updater-example/releases>.

7. Update the version in `package.json`, commit and push to GitHub.

8. Do steps 4 and 5 again.

9. Open the installed version of the app and see that it updates itself.
