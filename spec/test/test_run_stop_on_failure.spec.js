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

const ImptTestingHelper = require('../ImptTestingHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');

// Tests for stop-on-faulire behavior
describe('impt test run for stop-on-failure behavior >', () => {
    beforeAll((done) => {
        ImptTestingHelper.init().
            then(ImptTestCommandsHelper.cleanUpTestEnvironment).
            then(ImptTestCommandsHelper.createTestProductAndDG).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestCommandsHelper.cleanUpTestEnvironment().
            then(() => ImptTestingHelper.cleanUp()).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    it('run test with stop-on-fail=true', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/stop_on_failure', { 'stop-on-fail' : true }).
            then(() => ImptTestingHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut).not.toBeEmptyString();
                expect(commandOut).not.toMatch(/Using device test file tests\/2\.device\.test\.nut\n/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestingHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('run test with stop-on-fail=false', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/stop_on_failure', { 'stop-on-fail' : false }).
            then(() => ImptTestingHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut).not.toBeEmptyString();
                expect(commandOut).toMatch(/Using device test file tests\/2\.device\.test\.nut\n/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestingHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });
});
