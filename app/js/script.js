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
    const $resultTab = $('.nav-tabs').find('a[href="#result"]');
    const $tbody = $('.table').find('tbody');
    const $textarea = $('#links').find('textarea');
    const $filter = $('#filter');
    const $baseUrl = $('#base');
    const $modal = $('#modal');
    const $modalTitle = $modal.find('.modal-title');
    const $modalBody = $modal.find('.modal-body');
    const $modalFooter = $modal.find('.modal-footer');

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
        const index = options.index || '';
        const url = options.url || '';
        const jqXHR = options.jqXHR || {};
        const textStatus = options.textStatus || '';
        // change the text status "nocontent" to something more meaningful
        const message = textStatus === 'nocontent' ? 'success' : textStatus;

        const statusCode = jqXHR.status;
        const contentType = jqXHR.getResponseHeader('content-type');
        const contentLength = jqXHR.getResponseHeader('content-length');

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
        const updatedLinks = $modal.find('textarea').val().trim().split('\n');
        const baseUrl = $baseUrl.val().trim();
        invalidLinks = getUrls('invalid', updatedLinks, baseUrl);

        if (invalidLinks.length) {
            const content = generateModalContent(invalidLinks);
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

            const request = $.ajax({
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
        const links = $textarea.val().trim().split('\n');
        validLinks = getUrls('valid', links, baseUrl);
        invalidLinks = getUrls('invalid', links, baseUrl);

        if (invalidLinks.length) {
            const content = generateModalContent(invalidLinks);
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
        const $tr = $tbody.find('tr');
        $tr.hide();
        const filterText = $filter.val().toLowerCase();
        $tr.filter(function() {
            return $(this).text().indexOf(filterText) > -1;
        }).show();
    });
});
