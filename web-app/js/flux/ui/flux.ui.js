/*!
 * Flux
 * JavaScript/jQuery UI, based on Admintasia.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.UI = {
    
    /*
     * JavaScripts to load (order does matter).
     */
    scripts: [
        FLUX.META.ADMINTASIA_URL + "/ui/ui.core.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.widget.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.mouse.js",
        FLUX.META.ADMINTASIA_URL + "/live_search.js",
        FLUX.META.ADMINTASIA_URL + "/tooltip.js",
        FLUX.META.ADMINTASIA_URL + "/cookie.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.sortable.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.draggable.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.resizable.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.position.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.button.js",
        FLUX.META.ADMINTASIA_URL + "/ui/ui.dialog.js",
        FLUX.META.FLUX_URL + "/flux.jquery.js",
        FLUX.META.FLUX_URL + "/flux.ui.menu.js",
        FLUX.META.FLUX_URL + "/flux.ui.message.js",
        FLUX.META.FLUX_URL + "/flux.ui.dialog.js",
        FLUX.META.FLUX_URL + "/flux.ui.widget.js",
        FLUX.META.FLUX_URL + "/flux.ui.portlet.js",
        FLUX.META.FLUX_URL + "/flux.ui.grid.js",
        FLUX.META.FLUX_URL + "/flux.ui.form.js"
    ],
    
    /*
     * Initialize the UI.
     */
    init: function(callback) {
        // Load needed JavaScript code
        FLUX.loadScripts(this.scripts, 0, function() {
            // jQuery extras
            FLUX.JQUERY.init();
            // Initialize menu
            FLUX.UI.MENU.init();
            ////this.activateThemeChanger();
            // Initialize widgets
            FLUX.UI.WIDGET.hoverStaticWidgets();
            // Initialize portlets
            FLUX.UI.PORTLET.init();
            // Initialize grids
            FLUX.UI.GRID.init();
            // Execute callback function
            if (callback) callback();
        });
    },
    
    /*
     * Activate the theme changer on navigation menu entries.
     * Uses cookies.
     */
    activateThemeChanger: function() {
        jQuery(function() {
            jQuery('a.set_theme').click(function(event) {
                var theme_name = jQuery(this).attr("id");
                jQuery('body').append('<div id="theme_switcher" />');
                jQuery('#theme_switcher').fadeIn('fast');
                setTimeout(function () { 
                    jQuery('#theme_switcher').fadeOut('fast');
                }, 2000);
                setTimeout(function () { 
                    jQuery("link[title='style']").attr("href","css/themes/" + theme_name + "/ui.css");
                }, 500);
                jQuery.cookie('theme', theme_name );
                jQuery('a.set_theme').removeClass("active");
                jQuery(this).addClass("active");
            });
            var theme = jQuery.cookie('theme');
            jQuery("a.set_theme[id="+ theme +"]").addClass("active");
            if (theme == 'black_rose') {
                jQuery("link[title='style']").attr("href","css/themes/black_rose/ui.css");
            };
            if (theme == 'gray_standard') {
                jQuery("link[title='style']").attr("href","css/themes/gray_standard/ui.css");
            };
            if (theme == 'gray_lightness') {
                jQuery("link[title='style']").attr("href","css/themes/gray_lightness/ui.css");
            };
            if (theme == 'blueberry') {
                jQuery("link[title='style']").attr("href","css/themes/blueberry/ui.css");
            };
            if (theme == 'apple_pie') {
                jQuery("link[title='style']").attr("href","css/themes/apple_pie/ui.css");
            }; 
        });
    },
    
    /*
     * Dynamically evaluate content.
     * @param content: a string or a function returning a string.
     * @return A string.
     */
    evalContent: function(content) {
        // Check parameter
        if (content == null) {
            // Debug
            return '';
        }
        // A string
        if (typeof(content) == "string") {
            return content;
        }
        // A function
        else if (typeof(content) == "function") {
            return content();
        }
    },
    
    /*
     * Just render content somewhere.
     * @param where An object supporting .text(string) call.
     * @param content The content as a string or a function.
     */
    renderContent: function(where, content) {
        // Check parameters
        if (!where || !content) {
            // Debug
            return;
        }
        // A string, starts with http://?
        if (typeof(content) == "string" && content.match(/^http:\/\/.*/)) {
            // Async
            jQuery.get(content, function(data) {
                where.text(data);
            });
        } else {
            where.text(FLUX.UI.evalContent(content));
        }
    },
    
    /*
     * Set content after a selector or in a certain section, portlet, ...
     * @param map Map with keys
     *            after: place content after this 'selector'
     *            sectionId: place content in content-box of section
     *            portletId: place content in portlet-content of portlet
     *            content: a string.
     */
    placeContent: function(map) {
        // Check map
        if (!map.content) {
            // Debug
            alert("placeContent: no content!");
            return;
        }
        // Remove: element 'id' within 'sel' is removed
        var removeFn = function(sel, id) {
            var contained = jQuery(sel).has("#" + id);
            if (contained.length > 0) {
                jQuery("#" + id).remove();
            }
        };
        // 'Prepend to' a selector
        if (map.prepend) {
            if (map.replace) removeFn(map.prepend, map.replace);
            jQuery(map.prepend).prepend(map.content);
        }
        // 'Append to' a selector
        if (map.append) {
            if (map.replace) removeFn(map.append, map.replace);
            jQuery(map.append).append(map.content);
        }
        // 'After to' a selector
        if (map.after) {
            if (map.replace) removeFn(map.after, map.replace);
            jQuery(map.after).append(map.content);
        }
        // In a '-content' div in a 'section'
        if (map.toSectionId) {
            jQuery('div[id="' + map.toSectionId + '-content"]').append(map.content);
        }
        // In a .portlet-content in a portlet div
        if (map.toPortletId) {
            var portlet = FLUX.UI.PORTLET.getPortlet(map.toPortletId);
            if (portlet) {
                portlet.find('.portlet-content').append(map.content);
            }
        }
        // In a .column-content-box div .content-box-wrapper
        if (map.toContentBoxId) {
            map.contentBoxId = map.toContentBoxId;
            FLUX.UI.WIDGET.renderContentBoxContent(map);
        }
    },
    
    /*
     * Set a top note: HTML right before the buttons in the upper right corner.
     */
    setTopNote: function(map) {
        if (map.content) {
            jQuery("div#welcome span#welcomeNote").html(map.content);
        }
    },

    /*
     * Set page title and subtitle, will change the page and head/title.
     * @param map A map: title, subtitle (either can be empty).
     */
    setPageTitle: function(map) {
        var title = "";
        if (map.title) {
            jQuery("div#pageTitle h1").html(map.title);
            title += map.title;
        }
        if (map.subtitle) {
            jQuery("div#pageTitle span").html(map.subtitle);
            if (title.length > 0) title += " - ";
            title += map.subtitle;
        }
        if (title.length > 0) jQuery("head title").text(title);
    },
    
    /*
     * Clear pages' content area.
     */
    clearPageContent: function() {
        var sidebar = jQuery("div#page-content-wrapper div#sidebar").clone();
        jQuery("div#page-content-wrapper").html(sidebar);
    },
    
    /*
     * Page content has changed: re-initialize UI.
     */
    pageContentChanged: function() {
        FLUX.UI.WIDGET.hoverStaticWidgets();
        FLUX.UI.PORTLET.init();
    },
    
    /*
     * Change page content.
     * @param map A map:
     *            remote: A map. Fetch new page content from this URL using parameters.
     *                    url: URL to fetch content from.
     *                    params: Parameters to append to the URL.
     *                    method: HTTP method to use. Defaults to GET.
     */
    changePageContent: function(p) {
        this.clearPageContent();
        if (typeof(p) == 'object') {
            //p.remote jQuery().
        }
        if (typeof(p) == 'function') {
            p();
        }
        this.pageContentChanged();
    },
    
};

