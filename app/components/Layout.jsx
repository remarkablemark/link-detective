'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Links from './Links';
import Result from './Result';

/**
 * Layout component.
 */
export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            links: []
        };
        this._parseLinks = this._parseLinks.bind(this);
    }

    /**
     * Get parsed links from <Links>.
     *
     * @param {Array} links - The url links.
     */
    _parseLinks(links) {
        this.setState({
            links: links
        });
    }

    render() {
        return (
            <div className='container'>
                <h1 className='text-center text-muted'>Link Detective</h1>
                <br />

                <Tabs>
                    <Tab label='links'>
                        <Links parseLinks={this._parseLinks} />
                    </Tab>

                    <Tab label='result'>
                        <Result links={this.state.links} />
                    </Tab>
                </Tabs>

                {/*
                <div class='tab-content'>
                    <div role='tabpanel' class='tab-pane active' id='links'>
                        <br />
                        <div class='input-group'>
                            <span class='input-group-addon' data-toggle='tooltip' data-placement='right' title='Optional: prepends each link with the base url.'>
                                Base*
                            </span>
                            <input type='text' class='form-control' id='base' placeholder='http://www.domain.com' />
                        </div>
                        <br />

                        <textarea class='form-control' rows='10' data-toggle='tooltip' data-placement='bottom' title='Paste your links here.' style='height: 275px; resize: vertical;'></textarea>
                        <br />

                        <button type='submit' class='btn btn-primary' id='search'>
                            Search
                        </button>
                    </div><!-- /#links -->

                    <div role='tabpanel' class='tab-pane' id='result'>
                        <br />
                        <div class='input-group'>
                            <span class='input-group-addon' data-toggle='tooltip' data-placement='right' title='Optional: filter the search results.'>
                                Filter*
                            </span>
                            <input type='text' class='form-control' id='filter' />
                        </div><!-- /.input-group -->
                        <br />

                        <div class='table-responsive' style='height: 300px;'>
                            <table class='table table-hover'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>URL</th>
                                        <th>Status</th>
                                        <th>Content-Type</th>
                                        <th>Content-Length</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div><!-- /.table-responsive -->

                    </div><!-- /#result -->
                </div><!-- /.tab-content -->
            </div><!-- /.container -->

            <div class='modal fade' id='modal' tabindex='-1' role='dialog'>
                <div class='modal-dialog' role='document'>
                    <div class='modal-content'>

                        <div class='modal-header'>
                            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                            <h4 class='modal-title'>Invalid urls</h4>
                        </div><!-- /.modal-header -->

                        <div class='modal-body'></div>

                        <div class='modal-footer'>
                            <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
                            <button type='button' class='btn btn-primary' id='modal-update'>Update</button>
                            <button type='button' class='btn btn-warning' id='modal-continue'>Continue</button>
                        </div><!-- /.modal-footer -->

                    </div><!-- /.modal-content -->
                </div><!-- /.modal-dialog -->
            </div><!-- /#modal -->
            */}
            </div>
        );
    }
}
