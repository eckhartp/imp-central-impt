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

const Project = require('../../../lib/Project');
const Options = require('../../../lib/util/Options');

const COMMAND = 'link';
const COMMAND_SECTION = 'project';
const COMMAND_SHORT_DESCR = 'Creates new Project File by linking it to the specified Device Group.';
const COMMAND_DESCRIPTION = 'Creates new Project File in the current directory by linking it to the specified Device Group.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_GROUP_IDENTIFIER] : true,
        [Options.DEVICE_FILE] :  {
            demandOption : false,
            describe: 'Name of a file for IMP device source code. If the file does not exist, empty file is created.',
            default: 'device.nut'
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe: 'Name of a file for IMP agent source code. If the file does not exist, empty file is created.',
            default: 'agent.nut'
        },
        [Options.CONFIRMED] : false,
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            return Options.checkOptions(argv, options);
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Project(options).link(options);
};
