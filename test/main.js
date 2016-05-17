'use strict';

/**
 * Module dependencies.
 */
const Application = require('spectron').Application;
const assert = require('assert');
const path = require('path');

describe('application launch', function() {
    this.timeout(10000);

    before(function() {
        this.app = new Application({
            path: require('electron-prebuilt'),
            args: [path.join(__dirname, '../')]
        });
        return this.app.start();
    });

    after(function() {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it('shows an initial window', function(done) {
        this.app.client.getWindowCount().then(function(count) {
            assert.equal(count, 1);
            done();
        });
    });
});
