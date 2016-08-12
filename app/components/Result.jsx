'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

/**
 * Result component.
 */
export default class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.links.join('') === prevProps.links.join('')) {
            return false;
        }
        console.log(this.props.links);
        this.props.links.forEach((link, index) => {
            //const url = resolve(baseUrl, link);
            const url = link;

            const request = window.$.ajax({
                method: 'HEAD',
                url: url
            });

            request.done((message, textStatus, jqXHR) => {
                const data = this.state.data.slice();
                data.push({
                    index: index + 1,
                    url: url,
                    statusCode: jqXHR.status,
                    contentType: jqXHR.getResponseHeader('content-type'),
                    contentLength: jqXHR.getResponseHeader('content-length'),
                    message: textStatus
                });
                this.setState({ data: data });
            });

            request.fail((jqXHR, textStatus) => {
                const data = this.state.data.slice();
                data.push({
                    index: index + 1,
                    url: url,
                    statusCode: jqXHR.status,
                    contentType: jqXHR.getResponseHeader('content-type'),
                    contentLength: jqXHR.getResponseHeader('content-length'),
                    message: textStatus
                });
                this.setState({ data: data });
            });
        });
    }

    render() {
        console.log(this.state.data);
        return (
            <section>
                <TextField floatingLabelText='Filter'
                           floatingLabelFixed={true}
                           fullWidth={true}
                />

                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>#</TableHeaderColumn>
                            <TableHeaderColumn>URL</TableHeaderColumn>
                            <TableHeaderColumn>Status</TableHeaderColumn>
                            <TableHeaderColumn>Content-Type</TableHeaderColumn>
                            <TableHeaderColumn>Content-Length</TableHeaderColumn>
                            <TableHeaderColumn>Message</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>

                    <TableBody displayRowCheckbox={false}>
                        {this.state.data.map((item) => {
                            return (
                                <TableRow key={item.index}>
                                    <TableRowColumn>{item.index}</TableRowColumn>
                                    <TableRowColumn>{item.url}</TableRowColumn>
                                    <TableRowColumn>{item.statusCode}</TableRowColumn>
                                    <TableRowColumn>{item.contentType}</TableRowColumn>
                                    <TableRowColumn>{item.contentLength}</TableRowColumn>
                                    <TableRowColumn>{item.message}</TableRowColumn>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>
        );
    }
}

/**
 * Result props.
 */
Result.propTypes = {
    data: React.PropTypes.array
};
