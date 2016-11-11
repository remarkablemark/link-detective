'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { isWebUri } from 'valid-url';

/**
 * Links component.
 */
export default class Links extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };

        this._handleChange = this._handleChange.bind(this);
        this._handleClick = this._handleClick.bind(this);
    }

    _handleChange(event, value) {
        this.setState({
            text: value
        });
    }

    _handleClick() {
        const text = this.state.text;
        const links = text.trim().split('\n');

        const validLinks = links.filter((url) => {
            return isWebUri(url.trim());
        });

        // send links to parent
        this.props.parseLinks(validLinks);
    }

    render() {
        return (
            <section>
                <TextField hintText='Seperate each url with a space, comma, or newline.'
                           floatingLabelText='Enter or paste your URLs here'
                           multiLine={true}
                           rows={10}
                           fullWidth={true}
                           onChange={this._handleChange}
                />

                <RaisedButton label='Examine'
                              primary={true}
                              onClick={this._handleClick}
                />
            </section>
        );
    }
}
