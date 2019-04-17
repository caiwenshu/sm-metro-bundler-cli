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
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

/**
 * Migrate application to a new version of React Native.
 */
function validate() {
  const projectDir = process.cwd();

  warn('获取最新模板信息.');
  warn('读取本地template.json');


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

    if (remoteTemplatePackageJson["version"] != templateJSON["version"]
        || remoteTemplatePackageJson["dist"]["shasum"] != templateJSON["shasum"]) {
        warn(
            '本地版本:' +  templateJSON["version"] + ',服务器最新版本为:' + remoteTemplatePackageJson["version"] + '\n' +
            '本地shasum:' +  templateJSON["shasum"] + ',服务器最新shasum为:' + remoteTemplatePackageJson["dist"]["shasum"] + '\n' +
            '需要更新'
        );
        execSync("echo 1", {stdio:[0,1,2]});
        return
        // process.exit(1);
    }

    warn(
        '当前为最新版本无需更新'
    );

    execSync('echo 0', {stdio:[0,1,2]});

  return;
}

function warn(message) {
  console.warn(chalk.yellow(message));
}

const validateCommand = {
  name: 'validate',
  description: 'validate your app\'s template files is the latest version;',
  func: validate,
};

module.exports = validateCommand;
