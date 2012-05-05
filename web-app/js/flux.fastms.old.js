/*
 * fast.ms API.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
FLUX.FASTMS = {
    
    /*
     * Upload a file.
    upload: function(url, data, method) {
        // URL and data options required
        if (url) { 
            if (data) {
                // Data can be string of parameters or array/object
                data = typeof data == 'string' ? data : jQuery.param(data);
                // Split params into form inputs
                var inputs = '';
                jQuery.each(data.split('&'), function() {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
                });
            }
            // Build form
            var form = '';
            form += '<form action="'+ url +'" method="'+ (method || 'post') +'">';
            if (inputs) {
                form += inputs;
            }
            form += '</form>';
            // Send request
            jQuery(form).appendTo('body').submit().remove();
        };
    },
     */
    
    /*
     * Download something not JavaScript, HTML, JSON, XML.
    download: function(url, data, method) {
        // URL and data options required
        if (url) { 
            if (data) {
                // Data can be string of parameters or array/object
                data = typeof data == 'string' ? data : jQuery.param(data);
                // Split params into form inputs
                var inputs = '';
                jQuery.each(data.split('&'), function() {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
                });
            }
            // Build form
            var form = '';
            form += '<form action="'+ url +'" method="'+ (method || 'get') +'">';
            if (inputs) {
                form += inputs;
            }
            form += '</form>';
            // Send request
            jQuery(form).appendTo('body').submit().remove();
        };
    },
     */
    
    /*
     *
     */
    init: function() {
    },
    
    /*
     *
     */
    makeJSON: function() {
    },
    
    /*
     * http://fast.ms/d/user/db/document/selector
     *
     */
    get: function() {
    },
    
    /*
     *
     */
    post: function() {
    },
    
    /*
     *
     */
    publish: function() {
    },
    
    /*
     *
     */
    subscribe: function() {
    },
    
};
