/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var chalk = require('chalk');
var path = require('path');

function printRunInstructions(projectDir, projectName) {
  const absoluteProjectDir = path.resolve(projectDir);

  console.log(chalk.white.bold('项目创建成功,打开WebStorm查看:'));
  console.log('   cd ' + absoluteProjectDir);
  console.log('   运行 npm install ');
}

module.exports = printRunInstructions;
