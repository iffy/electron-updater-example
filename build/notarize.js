const { notarize } = require('electron-notarize');
const path = require('path');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.normalize(path.join(process.cwd(), 'dist', 'mac', `${appName}.app`));
  console.log('calling notarize with appPath = %s', appPath);
  return await notarize({
    appBundleId: 'com.github.iffy.electronupdaterexample',
    appPath: appPath,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};
