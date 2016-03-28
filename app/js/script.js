$(document).ready(() => {
    'use strict';

    /**
     * Module dependencies.
     */
    const resolve = require('url').resolve;

    /** Cache all selectors. */
    let $verifyBtn = $('#verify');
    let $resultTab = $('.nav-tabs').find('a[href="#result"]');
    let $tbody = $('.table').find('tbody');
    let $linksTextarea = $('#links').find('textarea');
    let $prefix = $('#prefix');
    let $filter = $('#filter');

    /** Initialize all opt-in functionality. */
    $('[data-toggle="tooltip"]').tooltip();

    /**
     * Append link request result to table body.
     *
     * @param {Object} options
     * @param {Number} options.index      - The index position of link.
     * @param {String} options.url        - The link url.
     * @param {Object} options.jqXHR      - The jQuery XHR object.
     * @param {Object} options.textStatus - The text message/status.
     */
    function appendResult(options) {
        options = options || {};
        let index = options.index || '';
        let url = options.url || '';
        let jqXHR = options.jqXHR || {};
        let textStatus = options.textStatus || '';

        let statusCode = jqXHR.status;
        let contentType = jqXHR.getResponseHeader('content-type');
        let contentLength = jqXHR.getResponseHeader('content-length');

        let context;
        // invalid url
        if (statusCode === 0) {
            context = 'warning';
        // success/redirect
        } else if (statusCode < 400) {
            context = '';
        // error
        } else {
            context = 'danger';
        }

        $tbody.append(
            `<tr class='${context}'>
                <th>${index}</th>
                <td>${url}</td>
                <td>${statusCode}</td>
                <td>${contentType}</td>
                <td>${contentLength}</td>
                <td>${textStatus}</td>
            </tr>`
        );
    };

    /** Verify the links. */
    $verifyBtn.click((event) => {
        event.preventDefault();
        $tbody.empty();
        $resultTab.tab('show');

        var links = $linksTextarea.val().trim().split('\n');
        links.forEach((link, index) => {
            let url = resolve($prefix.val(), link);
            let request = $.ajax({
                method: 'HEAD',
                url: url
            });

            request.done((message, textStatus, jqXHR) => {
                appendResult({
                    index: index + 1,
                    url: url,
                    jqXHR: jqXHR,
                    textStatus: textStatus
                });
            });

            request.fail((jqXHR, textStatus) => {
                appendResult({
                    index: index + 1,
                    url: url,
                    jqXHR: jqXHR,
                    textStatus: textStatus
                });
            });
        });
    });

    /** Filter the results. */
    $filter.keyup(() => {
        let $tr = $tbody.find('tr');
        $tr.hide();
        let filterText = $filter.val().toLowerCase();
        $tr.filter(function() {
            return $(this).text().indexOf(filterText) > -1;
        }).show();
    });
});
