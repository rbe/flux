/*
 * UI Messaging.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.UI.MESSAGE = {
    
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
        text += '<div class="response-msg error ui-corner-all">';
        if (!map.title) map.title = 'Erfolgsmeldung';
        text += '<span>' + map.title + '</span>';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
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
        text += '<div class="response-msg notice ui-corner-all">';
        text += '<span>' + map.title + '</span>';
        if (!map.title) map.title = 'Erfolgsmeldung';
        text += '<span>' + map.title + '</span>';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
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
        var text = "";
        text += '<div class="response-msg inf ui-corner-all">';
        if (!map.title) map.title = 'Erfolgsmeldung';
        text += '<span>' + map.title + '</span>';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
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
        text += '<div id="' + map.id + '" class="response-msg success ui-corner-all">';
        if (!map.title) map.title = 'Erfolgsmeldung';
        text += '<span>' + map.title + '</span>';
        if (!map.message) map.message = 'Keine Ahnung wofür...';
        text += map.message;
        text += '</div>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
}
