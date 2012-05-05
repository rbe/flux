/*
 * Portlet API.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.UI.PORTLET = {
    
    /*
     * Initialize portlets.
     */
    init: function() {
        jQuery(".portlet-header").hover(
            function() {
	        jQuery(this).addClass("ui-portlet-hover");
            },
	    function(){
	        jQuery(this).removeClass("ui-portlet-hover");
	    });
        jQuery(".portlet-header .ui-icon").click(function(event) {
	    jQuery(this).toggleClass("ui-icon-circle-arrow-n");
	    jQuery(this).parents(".portlet:first").find(".portlet-content").toggle();
        });
    },
    
    /*
     * Find a portlet by its id.
     * @param portletId ID attribute of portlet.
     */
    getPortlet: function(portletId) {
        // Check parameter
        if (!portletId) {
            // Debug
            return;
        }
        var portlet = null;
        if (portletId) {
            portlet = jQuery('div[id="' + portletId + '"]');
        }
        return portlet;
    },
    
    /*
     * Close or open a portlet, depends on its actual state.
     */
    togglePortlet: function(portletId) {
        var sel = "div#" + portletId + " div";
        jQuery(sel).toggleClass("ui-icon-circle-arrow-n");
        jQuery(sel).parents(".portlet:first").find(".portlet-content").toggle();
    },

    /*
     * Render a portlet.
     * @param map A map:
     *            portletId: value is used in id="" attribute.
     *            appendTo: Place it after a selector.
     *            title: a string or a function returning a title string.
     *            content: a string or a function returning the content as a string.
     *            placement: Where to place the content?
     */
    renderPortlet: function(map) {
        // Check map
        if (!map.portletId) {
            // Debug
            alert("renderPortlet: no portletId");
            return;
        }
        var text = '';
        // Open divs
        text += '<div id="' + map.portletId + '" class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all">';
        text += '  <div class="portlet-header ui-widget-header">';
        // Title
        text += GLUE.UI.evalContent(map.title);
        text += '    <span class="ui-icon ui-icon-circle-arrow-s"></span>';
        text += '  </div> <!-- portlet-header ' + map.portletId + ' -->';
        // Content
        text += '  <div class="portlet-content" style="display: block;">';
        text += GLUE.UI.evalContent(map.content);
        text += '  </div> <!-- portlet-content -->';
        text += '</div> <!-- portlet -->';
        // Set text at... key map.toSectionId must be set.
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },

    /*
     * Render content in a portlet, replacing existing one.
     * @param map A map:
     *            portletId: ID attribute of portlet.
     *            content: An URL or a function returning the content to set as a string.
     *            placement: Where to place the content?
     */
    renderPortletContent: function(map) {
        // Check map
        if (!map.portletId) {
            // Debug
            return;
        }
        // Set text at... key map.toPortletId must be set.
        if (!map.placement) map.placement = {};
        map.placement.toPortletId = map.portletId;
        // A string, starts with http://?
        if (typeof(map.content) == "string" && map.content.match(/^http:\/\/.*/)) {
            // Async
            jQuery.get(map.content, function(data) {
                map.placement.content = data;
                GLUE.UI.placeContent(map.placement);
            });
        } else {
            map.placement.content = GLUE.UI.evalContent(map.content);
            GLUE.UI.placeContent(map.placement);
        }
    },
    
}
