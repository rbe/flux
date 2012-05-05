/*!
 * Flux
 * UI Messaging.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.UI.MESSAGE = {
    
    /*
     * Show an error message.
     * @param map A map:
     *            title: title.
     *            message: the message.
     *            placement: placement options.
     */
    error: function(map) {
        // Check map
        // Create HTML
        var text = "";
        text += '<div';
        if (map.id) text += ' id="' + map.id + '"';
        text += ' class="response-msg error ui-corner-all">';
        if (!map.title) map.title = 'Fehler';
        text += '<span class="flux-notice">' + map.title + '</span>';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     * Show a notice.
     * @param map A map:
     *            title: title.
     *            message: the message.
     *            placement: placement options.
     */
    notice: function(map) {
        // Check map
        // Create HTML
        var text = "";
        text += '<div';
        if (map.id) text += ' id="' + map.id + '"';
        text += ' class="response-msg notice ui-corner-all">';
        if (!map.title) map.title = 'Hinweis';
        text += '<span class="flux-notice">' + map.title + '</span>\n';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     * Show an informational message.
     * @param map A map:
     *            title: title.
     *            message: the message.
     *            placement: placement options.
     */
    information: function(map) {
        // Check map
        // Create HTML
        var text = '';
        text += '<div';
        if (map.id) text += ' id="' + map.id + '"';
        text += ' class="response-msg inf ui-corner-all">\n';
        if (!map.title) map.title = 'Information';
        text += '<span class="flux-notice">' + map.title + '</span>\n';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message + '\n';
        text += '</div>\n';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     * Show a success message.
     * @param map A map:
     *            title: title.
     *            message: the message.
     *            placement: placement options.
     */
    success: function(map) {
        // Check map
        // Create HTML
        var text = "";
        text += '<div';
        if (map.id) text += ' id="' + map.id + '"';
        text += ' class="response-msg success ui-corner-all">';
        if (!map.title) map.title = 'Erfolgsmeldung';
        text += '<span class="flux-notice">' + map.title + '</span>';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
};
