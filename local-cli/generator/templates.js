/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const copyProjectTemplateAndReplace = require('./copyProjectTemplateAndReplace');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

/**
 * @param destPath Create the new project at this path.
 * @param newProjectName For example 'AwesomeApp'.
 * @param template Template to use, for example 'navigation'.
 */
function createProjectFromTemplate(destPath, newProjectName, template) {
  // Expand the basic 'HelloWorld' template
  // copyProjectTemplateAndReplace(
  //   path.resolve('local-cli', 'templates', 'sm-react-native-templates'),
  //   destPath,
  //   newProjectName
  // );

    console.log(
        'This will walk you through creating a new React Native project in',
        destPath
    );

    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
    }

    const packageJson = {
        name: newProjectName,
        version: '0.0.1',
        private: true,
    };

    fs.writeFileSync(
        path.join(destPath, 'package.json'),
        JSON.stringify(packageJson),
    );
    process.chdir(destPath);

  if (template === undefined) {
    // No specific template, use just the HelloWorld template above
    return;
  }

    // template is e.g. 'ignite',
    // use the template react-native-template-ignite from npm
    createFromRemoteTemplate(template, destPath, newProjectName);
}


function upgradeProjectFromTemplate(destPath, newProjectName, template, remotePackageInfo) {

    console.log(
        'This will walk you through upgrade React Native project in',
        destPath
    );

    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
    }

    const packageJson = {
        name: newProjectName,
        version: '0.0.1',
        private: true,
    };

    fs.writeFileSync(
        path.join(destPath, 'package.json'),
        JSON.stringify(packageJson),
    );
    process.chdir(destPath);

    if (template === undefined) {
        // No specific template, use just the HelloWorld template above
        return;
    }

    // template is e.g. 'ignite',
    // use the template react-native-template-ignite from npm

    // Check if the template exists
    console.log(`Fetching template ${template}...`);
    try {

        execSync(`npm install ${template} --save --save-exact --ignore-scripts`, {stdio: 'inherit'});

        const templatePath = path.resolve(
            'node_modules', template
        );
        copyProjectTemplateAndReplace(
            templatePath,
            destPath,
            newProjectName,
            {
                // Every template contains a dummy package.json file included
                // only for publishing the template to npm.
                // We want to ignore this dummy file, otherwise it would overwrite
                // our project's package.json file.
                ignorePaths: ['package.json', 'dependencies.json'],
                upgrade: true
            }
        );
        reinstallTemplateDependencies(templatePath, destPath, newProjectName, remotePackageInfo);
    } finally {

    }

}

/**
 * The following formats are supported for the template:
 * - 'demo' -> Fetch the package react-native-template-demo from npm
 * - git://..., http://..., file://... or any other URL supported by npm
 */
function createFromRemoteTemplate(template, destPath, newProjectName) {
  let installPackage;
  let templateName;
  installPackage = template;
  templateName = installPackage;

  // Check if the template exists
  console.log(`Fetching template ${installPackage}...`);
  try {

      var returnInfo = execSync(`npm info ${installPackage} --json`);
      var packpageInfo = returnInfo.toString();
      var templatePackageJson = JSON.parse(packpageInfo);
      console.log(`npm info ${installPackage} --json`);

    execSync(`npm install ${installPackage} --save --save-exact --ignore-scripts`, {stdio: 'inherit'});

    const templatePath = path.resolve(
      'node_modules', templateName
    );
    copyProjectTemplateAndReplace(
      templatePath,
      destPath,
      newProjectName,
      {
        // Every template contains a dummy package.json file included
        // only for publishing the template to npm.
        // We want to ignore this dummy file, otherwise it would overwrite
        // our project's package.json file.
        ignorePaths: ['package.json', 'dependencies.json']
      }
    );
      reinstallTemplateDependencies(templatePath, destPath, newProjectName, templatePackageJson);
  } finally {
    // Clean up the temp files
    // 不取消 模板内容，运行时，自动删除
      // try {
    //    execSync(`npm uninstall ${templateName} --ignore-scripts`);
    // } catch (err) {
    //   // Not critical but we still want people to know and report
    //   // if this the clean up fails.
    //   console.warn(
    //     `Failed to clean up template temp files in node_modules/${templateName}. ` +
    //     'This is not a critical error, you can work on your app.'
    //   );
    // }
  }
}

function reinstallTemplateDependencies(templatePath, destPath, newProjectName, templatePackageJson) {
    // dependencies.json is a special file that lists additional dependencies
    // that are required by this template
    const packageJsonPath = path.resolve(
        templatePath, 'package.json'
    );
    console.log('Adding dependencies for the project...');
    if (!fs.existsSync(packageJsonPath)) {
        console.log('No additional dependencies.');
        return;
    }

    let dependencies;
    try {
        dependencies = JSON.parse(fs.readFileSync(packageJsonPath));

        var packageJson = {
            name: newProjectName,
            version: '0.0.1',
            private: true,
            scripts:dependencies["scripts"],
            dependencies:dependencies["dependencies"],
            jest:dependencies["jest"],
            devDependencies:dependencies["devDependencies"],
        };

        console.log(packageJson);

        fs.writeFileSync(
            path.join(destPath, 'package.json'),
            JSON.stringify(packageJson,  null, '\t'),
        );


        const packageLockJsonPath = path.resolve(
            destPath, 'package-lock.json'
        );
        if (fs.existsSync(packageLockJsonPath)) {
            fs.unlinkSync(packageLockJsonPath);
        };

        // 删除node_moudles下所有文件
        const nodeModulesPath = path.resolve(
            destPath, 'node_modules'
        );

        removeDir(nodeModulesPath);

    } catch (err) {
        throw new Error(
            'Could not parse the template\'s package.json: ' + err.message
        );
    }

    // 写入模板的基本信息，用于模板检查和升级
    const baseFrameworkJson = {
        name: templatePackageJson["name"],
        version: templatePackageJson["version"],
        shasum: templatePackageJson["dist"]["shasum"],
    };

    fs.writeFileSync(
        path.join(destPath, 'template.json'),
        JSON.stringify(baseFrameworkJson,  null, '\t'),
    );

};

function removeDir(dir) {
    let files = fs.readdirSync(dir)
    for(var i=0;i<files.length;i++){
        let newPath = path.join(dir,files[i]);
        let stat = fs.statSync(newPath)
        if(stat.isDirectory()){
            //如果是文件夹就递归下去
            removeDir(newPath);
        }else {
            //删除文件
            fs.unlinkSync(newPath);
        }
    }
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
};

module.exports = {
  createProjectFromTemplate,
  upgradeProjectFromTemplate
};
