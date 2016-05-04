'use strict';

/**
 * Module dependencies.
 */
const resolve = require('url').resolve;
const isWebUri = require('valid-url').isWebUri;

/**
 * Document ready.
 */
$(document).ready(() => {
    let validLinks;
    let invalidLinks;

    /** Cache selectors. */
    let $resultTab = $('.nav-tabs').find('a[href="#result"]');
    let $tbody = $('.table').find('tbody');
    let $textarea = $('#links').find('textarea');
    let $filter = $('#filter');
    let $baseUrl = $('#base');
    let $modal = $('#modal');
    let $modalTitle = $modal.find('.modal-title');
    let $modalBody = $modal.find('.modal-body');
    let $modalFooter = $modal.find('.modal-footer');

    /** Update textarea placeholder. */
    $textarea.attr('placeholder', [
        '/path/page.html',
        'http://example.com'
    ].join('\n'));

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
        // change the text status "nocontent" to something more meaningful
        let message = textStatus === 'nocontent' ? 'success' : textStatus;

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
                <td>${message}</td>
            </tr>`
        );
    };

    /**
     * Get valid or invalid urls.
     *
     * @param  {Boolean}        type - The type: 'valid' or 'invalid'.
     * @param  {(Array|String)} urls - The urls.
     * @param  {String} baseUrl      - The base url.
     * @return {Array}
     */
    function getUrls(type, urls, baseUrl) {
        if (typeof urls === 'string') {
            urls = urls.trim().split('\n');
        }

        if (type === 'valid') {
            return urls.filter((url) => {
                url = url.trim();
                return isWebUri(url) || isWebUri(resolve(baseUrl, url));
            });

        } else if (type === 'invalid') {
            return urls.filter((url) => {
                url = url.trim();
                return !(isWebUri(url) || isWebUri(resolve(baseUrl, url)));
            });
        }
    }

    /** Validate the links again. */
    $('#modal-update').click(() => {
        let updatedLinks = $modal.find('textarea').val().trim().split('\n');
        const baseUrl = $baseUrl.val().trim();
        invalidLinks = getUrls('invalid', updatedLinks, baseUrl);

        if (invalidLinks.length) {
            let content = generateModalContent(invalidLinks);
            $modalTitle.text(content.title);
            $modalBody.html(content.body);
            $modal.modal('show');
        } else {
            $tbody.empty();
            $modal.modal('hide');
            $resultTab.tab('show');
            verifyLinks(validLinks.concat(updatedLinks), baseUrl);
        }
    });

    /** Continue and verify links. */
    $('#modal-continue').click(() => {
        $tbody.empty();
        $modal.modal('hide');
        $resultTab.tab('show');
        verifyLinks(validLinks.concat(invalidLinks), $baseUrl.val().trim());
    });

    /**
     * Generate modal content based on invalid links.
     *
     * @param  {Array} invalidLinks - The invalid links.
     * @return {String}
     */
    function generateModalContent(invalidLinks) {
        return {
            title: `${invalidLinks.length} invalid urls`,
            body: `
                <p>The following urls are invalid:</p>
                <textarea class='form-control' rows='5' style='resize: vertical;'>${invalidLinks.join('\n')}</textarea>
                <br>
                <p>You can either fix and update them or continue the search with the current urls.<p>
            `
        };
    }

    /**
     * Verify the links via the HEAD request.
     *
     * @param  {Array} links   - The links.
     * @param  {Array} baseUrl - The base url.
     */
    function verifyLinks(links, baseUrl) {
        links.forEach((link, index) => {
            const url = resolve(baseUrl, link);

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
    }

    /** Validate the links before making the requests. */
    $('#search').click((event) => {
        event.preventDefault();

        const baseUrl = $baseUrl.val().trim();
        let links = $textarea.val().trim().split('\n');
        validLinks = getUrls('valid', links, baseUrl);
        invalidLinks = getUrls('invalid', links, baseUrl);

        if (invalidLinks.length) {
            let content = generateModalContent(invalidLinks);
            $modalTitle.text(content.title);
            $modalBody.html(content.body);
            $modal.modal('show');
        } else {
            $tbody.empty();
            $resultTab.tab('show');
            verifyLinks(links, baseUrl);
        }
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
