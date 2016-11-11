'use strict';

/**
 * Upgrade the require hook so `jsx` files are transpiled.
 */
require('babel-register')({
    presets: ['es2015', 'react'],
    extensions: ['.jsx']
});

/**
 * Module dependencies.
 */
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./components/App');

/**
 * Render app.
 */
ReactDOM.render(
    React.createElement(App),
    document.getElementById('app')
);
