const { notarize } = require('electron-notarize');
const path = require('path');
const fs = require('fs');
const jsYaml = require('js-yaml');

function findPackageJsonPath() {
  let dirName = process.cwd();

  while(dirName) {
    const packageJsonFilePath = path.join(dirName, 'package.json');
    if (fs.existsSync(packageJsonFilePath)) {
      return packageJsonFilePath;
    } else if (dirName === '/') {
      break;
    }
    dirName = path.dirname(dirName);
  }
  return undefined;
}

function getAppId(context) {
  // Try to get the appId from the packager
  const config = context.packager.info._configuration;
  if (config && config.appId) {
    console.log('Found appId in packager');
    return config.appId;
  }

  // Try to get the appId from the builder-effective-config.yml file
  const builderEffectiveConfigPath = path.join(context.outDir, 'builder-effective-config.yaml');
  if (fs.existsSync(builderEffectiveConfigPath)) {
    const builderEffectiveConfigText = fs.readFileSync(builderEffectiveConfigPath);
    const builderEffectiveConfig = jsYaml.load(builderEffectiveConfigText);
    if (builderEffectiveConfig['appId']) {
      console.log('Found appId in %s', builderEffectiveConfigPath);
      return builderEffectiveConfig['appId'];
    }
  }

  // Try to get the appId from the package.json file
  const packageJsonFilePath = findPackageJsonPath();
  if (packageJsonFilePath) {
    try {
      const packageJson = require(packageJsonFilePath);
      if (packageJson['build'] && packageJson['build']['appId']) {
        console.log('Found appId in %s', packageJsonFilePath);
        return packageJson['build']['appId'];
      }
    } catch (err) {
      // swallow the error
      console.log('Failed to read %s: %s', packageJsonFilePath, err);
    }
  }

  // finally, check the APP_ID environment variable
  if (process.env.APP_ID) {
    console.log('Found appId in APP_ID environment variable');
    return process.env.APP_ID;
  }
  throw new Error('Unable to find the application ID');
}

exports.default = async function notarizing(context) {
  const { electronPlatformName } = context;
  if (electronPlatformName !== 'darwin' || process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
    return;
  }

  const appId = getAppId(context);
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.normalize(path.join(context.outDir, 'mac', `${appName}.app`));
  console.log('calling notarize for appId = %s with appPath = %s', appId, appPath);
  return notarize({
    appBundleId: appId,
    appPath: appPath,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};
