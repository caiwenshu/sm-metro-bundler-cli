/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const chalk = require('chalk');
const copyProjectTemplateAndReplace = require('../generator/copyProjectTemplateAndReplace');
const fs = require('fs');
const path = require('path');
const printRunInstructions = require('../generator/printRunInstructions');
const semver = require('semver');
const yarn = require('../util/yarn');
const execSync = require('child_process').execSync;

const {
    upgradeProjectFromTemplate,
} = require('../generator/templates');

/**
 * Migrate application to a new version of React Native.
 * See http://facebook.github.io/react-native/docs/upgrading.html
 *
 * IMPORTANT: Assumes the cwd() is the project directory.
 * The code here must only be invoked via the CLI:
 * $ cd MyAwesomeApp
 * $ react-native upgrade
 */
function validateAndUpgrade() {
  const projectDir = process.cwd();

  const packageJSON = JSON.parse(
      fs.readFileSync(path.resolve(projectDir, 'package.json'), 'utf8')
  );

  warn('开始执行模板更新....');

  const projectName = packageJSON.name;
  if (!projectName) {
    warn(
      'Your project needs to have a name, declared in package.json, ' +
      'such as "name": "AwesomeApp". Please add a project name. Aborting.'
    );
    return;
  }

    const templateJSON = JSON.parse(
        fs.readFileSync(path.resolve(projectDir, 'template.json'), 'utf8')
    );
    const installPackage = templateJSON["name"];

    var returnInfo = execSync(`npm info ${installPackage} --json`);
    var packpageInfo = returnInfo.toString();
    warn(`npm info ${installPackage} --json`);

    var remoteTemplatePackageJson = null;

    try {
        remoteTemplatePackageJson = JSON.parse(packpageInfo);

    } catch (err) {
        throw new Error(
            'Could not parse the template.json info: ' + err.message
        );
    }

    if (semver.lte(remoteTemplatePackageJson["version"], templateJSON["version"])) {
        warn(
            '当前为最新版本，无需更新'
        );
        return;
    }

    warn(
        '发现' + remoteTemplatePackageJson["name"] + ' 新版本:' + remoteTemplatePackageJson["version"]
    );

  return new Promise((resolve) => {
    upgradeProjectFiles(projectDir, projectName, remoteTemplatePackageJson);
    console.log(
      'Successfully upgraded this project to  ' + remoteTemplatePackageJson["name"]  + " version: " + remoteTemplatePackageJson["version"]
    );
    resolve();
  });
}

/**
 * Once all checks passed, upgrade the project files.
 */
function upgradeProjectFiles(projectDir, projectName, remoteTemplatePackageJson) {
  // Just owerwrite
    upgradeProjectFromTemplate(projectDir, projectName, 'sm-react-native-templates', remoteTemplatePackageJson)
}

function warn(message) {
  console.warn(chalk.yellow(message));
}

const upgradeCommand = {
  name: 'upgrade',
  description: 'upgrade your app\'s template files to the latest version; run this after ' +
    'updating the react-native version in your package.json and running npm install',
  func: validateAndUpgrade,
};

module.exports = upgradeCommand;
