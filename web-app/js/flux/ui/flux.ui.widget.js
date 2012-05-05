/*!
 * Flux
 * Widget API.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.UI.WIDGET = {
    
    /*
     * Attach hiover actions to static widgets.
     */
    hoverStaticWidgets: function() {
        jQuery('.ui-state-default').hover(
            function() {
                jQuery(this).addClass('ui-state-hover');
            },
            function() {
                jQuery(this).removeClass('ui-state-hover');
            }
        );
    },
    
    /*
     * Initialize live search functionality.
     * @param map A map: url: URL to post search term to.
     */
    initLiveSearch: function(map) {
        // Live Search
        jQuery('#search-bar input[name="q"]').liveSearch({url: map.url });
    },
    
    /*
     * Render a section: title, subtitle and content-box.
     * @param map A map:
     *            sectionId: ID for section.
     *            appendTo: Place it after a selector.
     *            title: A string or a function for the title.
     *            subtitle: A string or a function for the sub-title.
     *            content: a string or a function returning the content as a string.
     *            placement: Where to place the content?
     */
    renderSection: function(map) {
        // Check map
        if (!map.sectionId) {
            // Debug
            return;
        }
        //
        var text = '';
        // Create section
        text += '<div id="' + map.sectionId + '" class="inner-page-title">';
        text += '<h2>' + FLUX.UI.evalContent(map.title) + '</h2>';
        text += '<span>' + FLUX.UI.evalContent(map.subtitle) + '</span>';
        text += '</div> <!-- inner-page-title for section ' + map.sectionId + ' -->';
        // Add content div in section
        text += '<div id="' + map.sectionId + '-content" class="content-box">';
        text += '</div> <!-- content-box for section ' + map.sectionId + ' -->';
        // Set text at ...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     *
     * @param map A map:
     */
    renderOtherBox: function(map) {
        // Check map
        //
        var text = "";
        text += '<div id="' + map.otherBoxId + '" class="other-box yellow-box ui-corner-all ui-corner-all">';
        text += '  <div class="cont tooltip ui-corner-all">';
        text += '    <h3>' + map.title + '</h3>';
        text += '    <p>' + map.content + '</p>';
        text += '  </div>';
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
     *
     * @param map A map:
     */
    renderTooltip: function(map) {
    },
    
    /*
     * Render a content box.
     * @param map A map:
     *            placement: Where to place the content?
     */
    renderContentBox: function(map) {
        // Check parameter
        // Build HTML
        var text = "";
        text += '<div id="' + map.contentBoxId + '" class="column-content-box">';
        text += '  <div class="content-box content-box-header ui-corner-all">';
        text += '    <div class="ui-state-default ui-corner-top ui-box-header">';
        text += '      <span class="ui-icon float-left ui-icon-signal"></span>';
        text += '      ' + map.title;
        text += '    </div>';
        text += '    <div id="' + map.contentBoxId + '-wrapper" class="content-box-wrapper">';
        if (map.content) text += map.content;
        text += '    </div>';
        text += '  </div>';
        text += '</div>';
        // Set text at ...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     * Render content to an existing content box.
     * @param map A map:
     *            contentBoxId: ID of content box
     *            content: Content to render.
     */
    renderContentBoxContent: function(map) {
        var contentSel = 'div#' + map.contentBoxId + '-wrapper';
        jQuery(contentSel).append(FLUX.UI.evalContent(map.content));
    },
    
    /*
     * Render a button.
     * @params map A map:
     *             icon: CSS class for icon, w/o leading 'ui-icon-', see http://demo.admintasia.com/icons.php, defaults to 'signal-diag'.
     */
    renderButton: function(map) {
        // Check map
        //
        var text = "";
        text += '<a id="' + map.buttonId + '" class="btn ui-state-default ui-corner-all" href="#">';
        if (!map.icon) map.icon = "signal-diag";
        text += '  <span class="ui-icon ui-icon-' + map.icon + '"></span>';
        text += '  ' + map.title;
        text += '</a>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
};
