'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Layout from './Layout';

// needed for `onTouchTap` for material-ui
// http://www.material-ui.com/#/get-started/installation
require('react-tap-event-plugin')();

/**
 * App component.
 */
class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Layout />
            </MuiThemeProvider>
        );
    }
}

module.exports = App;
