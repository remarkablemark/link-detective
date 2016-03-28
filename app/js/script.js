$(document).ready(() => {
    'use strict';

    /** Cache all selectors. */
    let $verifyBtn = $('#verify');
    let $resultTab = $('.nav-tabs').find('a[href="#result"]');
    let $tbody = $('.table').find('tbody');
    let $linksTextarea = $('#links').find('textarea');

    /**
     * Append link request result to table body.
     *
     * @param {Number} index - The index position of the link.
     * @param {String} url   - The link url.
     * @param {Object} jqXHR - The jQuery XHR object.
     */
    let appendResult = (index, url, jqXHR) => {
        index = index || '';
        url = url || '';
        jqXHR = jqXHR || {};

        let statusCode = jqXHR.status;
        let contentType = jqXHR.getResponseHeader('content-type');
        let contentLength = jqXHR.getResponseHeader('content-length');

        let context;
        // invalid url
        if (statusCode === 0) {
            context = 'warning';
        // success
        } else if (statusCode < 300) {
            context = '';
        // redirect
        } else if (statusCode < 400) {
            context = 'info';
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
            let url = link.trim();
            let request = $.ajax({
                method: 'HEAD',
                url: url
            });

            request.done((message, textStatus, jqXHR) => {
                appendResult(index + 1, url, jqXHR);
            });

            request.fail((jqXHR, textStatus) => {
                appendResult(index + 1, url, jqXHR);
            });
        });
    });
});