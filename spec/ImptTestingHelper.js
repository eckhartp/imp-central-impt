// MIT License
//
// Copyright 2018 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
// OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

'use strict';

require('jasmine-expect');

const Shell = require('shelljs');
const FS = require('fs');
const config = require('./config');
const Utils = require('../lib/util/Utils');
const UserInteractor = require('../lib/util/UserInteractor');

const TIMEOUT_MS = 100000;
const TESTS_EXECUTION_FOLDER = `${__dirname}/../__test`;

// Helper class for testing impt tool.
// Contains common methods for testing environment initialization and cleanup,
// running impt commands, check commands output, ...
class ImptTestingHelper {
    static get TIMEOUT() {
        return TIMEOUT_MS;
    }

    static get TESTS_EXECUTION_FOLDER() {
        return TESTS_EXECUTION_FOLDER;
    }

    static get ATTR_NAME() {
        return 'name';
    }

    static get ATTR_DESCRIPTION() {
        return 'description';
    }

    static get ATTR_ID() {
        return 'id';
    }

    // Initializes testing environment: creates test execution folder, sets default jasmine test timeout.
    // Optionally executes 'impt auth login --local' command in the test execution folder.
    // Should be called from any test suite beforeAll method.
    static init(login = true) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_MS;
        Utils.removeDirSync(TESTS_EXECUTION_FOLDER);
        FS.mkdirSync(TESTS_EXECUTION_FOLDER);
        if (login) {
            const endpoint = config.apiEndpoint ? `--endpoint ${config.apiEndpoint}` : '';
            return ImptTestingHelper.runCommand(
                `impt auth login --local --user ${config.email} --pwd ${config.password} ${endpoint}`,
                ImptTestingHelper.checkSuccessStatus);
        }
        return Promise.resolve();
    }

    // Cleans up testing environment.
    // Should be called from any test suite afterAll method.
    static cleanUp() {
        Shell.cd(__dirname);
        Utils.removeDirSync(TESTS_EXECUTION_FOLDER);
        return Promise.resolve();
    }

    // Executes impt command and calls outputChecker function to check the command output
    static runCommand(command, outputChecker) {
        return new Promise((resolve, reject) => {
                if (config.debug) {
                    console.log('Running command: ' + command);
                }
                Shell.cd(TESTS_EXECUTION_FOLDER);
                Shell.exec(`node ${__dirname}/../bin/${command}`, { silent : !config.debug }, (code, stdout, stderr) => {
                    resolve(stdout);
                });
            }).
            then(outputChecker);
    }

    // Checks IMPT COMMAND SUCCEEDS status of the command
    static checkSuccessStatus(commandOut) {
        expect(commandOut).toMatch('IMPT COMMAND SUCCEEDS');
    }

    // Checks IMPT COMMAND FAILS status of the command
    static checkFailStatus(commandOut) {
        expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
        expect(commandOut).toMatch('IMPT COMMAND FAILS');
    }

    // Does not check command status, just check 'Access to impCentral failed or timed out' error doesn't occur.
    static emptyCheck(commandOut) {
        expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
    }

    // Checks if the command output contains the specified attribute name and value
    static checkAttribute(commandOut, attrName, attrValue) {
        expect(commandOut).toMatch(new RegExp(`${attrName}:\\s+${attrValue}`));
    }
}

module.exports = ImptTestingHelper;
