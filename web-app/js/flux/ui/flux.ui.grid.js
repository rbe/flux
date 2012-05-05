/*!
 * Flux
 * Grid API.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.UI.GRID = {
    
    /*
     * JavaScripts to load (order does matter).
     */
    scripts: [
        FLUX.META.ADMINTASIA_URL + "/flexigrid.js",
    ],
    
    /*
     * Initialize the UI.
     */
    init: function(callback) {
        // Load needed JavaScript code
        FLUX.loadScripts(this.scripts, 0, function() {
            // Execute callback function
            if (callback) callback();
        });
    },
    
    /*
     * Render a grid.
     * @param map A map
     */
    renderGrid: function(map) {
        // Check map
        //
        var text = '';
        text += '<table id="' + map.tableId + '" name="' + map.tableId + '">';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     * Activate a grid: do all JavaScript stuff and connect to a web service.
     * @param map A map
     */
    activateGrid: function(map) {
        var grid = jQuery('#' + map.gridId);
        grid.flexigrid({
            url: map.url || false,
            dataType: 'json',
            colModel: map.columns,
            buttons: map.buttons || false,
            searchitems: map.searchItems,
            sortname: map.sortBy || "",
            sortorder: map.sortOrder || "asc",
            usepager: true,
            title: map.title || "Staff",
            useRp: true,
            rp: map.maxResults || 10,
            rpOptions: map.maxResultsOptions || [10, 25, 50, 100],
            showTableToggleBtn: true,
            resizable: map.resizable || true,
            width: (map.css && map.css.width) || 'auto',
            height: (map.css && map.css.height) || 'auto',
            singleSelect: map.singleSelect || true,
            autoload: map.autoload || false
        });
        // Show quick search bar
        if (map.showQuickSearch) this.showQuickSearch({ gridId: map.gridId, display: 'block' });
        // Should we look for a certain term?
        if (map.searchTerm && map.searchTerm != '') {
            setTimeout(function() {
                FLUX.UI.GRID.performSearch({ gridId: map.gridId, searchTerm: map.searchTerm });
            }, 500);
        }
    },
    
    /*
     *
     */
    showQuickSearch: function(map) {
        var grid = jQuery('#' + map.gridId);
        if (grid && grid[0]) {
            // Find input field for search term
            var quickSearchDiv = jQuery(grid[0].grid.sDiv);
            quickSearchDiv.css('display', map.display || 'none');
        } else {
            FLUX.LOG.warning('Could not find grid with id="' + map.gridId + '"');
        }
    },
    
    /*
     *
     */
    performSearch: function(map) {
        var grid = jQuery('#' + map.gridId);
        // Find input field for search term
        var quickSearchDiv = jQuery(grid[0].grid.sDiv);
        var q = quickSearchDiv.find('input[name="q"]');
        q.val(map.searchTerm);
        // Create RETURN key event
        var keyReturn = jQuery.Event('keydown');
        keyReturn.keyCode = 13;
        // Find input field for search term
        q.trigger(keyReturn);
    },
    
};
