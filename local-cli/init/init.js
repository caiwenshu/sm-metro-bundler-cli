/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const {
    createProjectFromTemplate,
} = require('../generator/templates');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const printRunInstructions = require('../generator/printRunInstructions');

/**
 * Creates the template for a React Native project given the provided
 * parameters:
 * @param projectDir Templates will be copied here.
 * @param argsOrName Project name or full list of custom arguments
 *                   for the generator.
 * @param options Command line options passed from the react-native-cli directly.
 *                E.g. `{ version: '0.43.0', template: 'navigation' }`
 */
function init(args) {
    // args array is e.g. ['AwesomeApp', '--verbose', '--template', 'navigation']
    if (!args || args.length === 0) {
        console.error('react-native init requires a project name.');
        return;
    }
    var projectName = args[0];
    var destinationRoot = path.resolve(".", projectName)
    console.log('Setting up new React Native app in ' + path.resolve("."));
    console.log('Setting up new React Native app name is : ' + projectName);
    generateProject(destinationRoot, projectName);
}

/**
 * Generates a new React Native project based on the template.
 * @param Absolute path at which the project folder should be created.
 * @param options Command line arguments parsed by minimist.
 */
function generateProject(destinationRoot, newProjectName) {

    createProjectFromTemplate(destinationRoot, newProjectName, 'sm-react-native-templates');

    printRunInstructions(destinationRoot, newProjectName);
}

module.exports = init;
