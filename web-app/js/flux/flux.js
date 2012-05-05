/*!
 * Flux.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
var FLUX = function($) {
    
    /*
     * Flux Metadata.
     */
    var META = {
        // URL prefix
        URL_PREFIX : FLUX.API_URL_PREFIX + "/flux",
        // URL to Flux libraries
        FLUX_URL : FLUX.API_URL_PREFIX + "/flux/" + FLUX.VERSION.FLUX + "/js",
        // Dependencies to other libraries
        JQUERY_URL : FLUX.API_URL_PREFIX + "/jquery/" + FLUX.VERSION.JQUERY
                + "/jquery.min.js",
        ADMINTASIA_URL : FLUX.API_URL_PREFIX + "/admintasia/"
                + FLUX.VERSION.ADMINTASIA + "/js",
    },
    KEYCODE = {
        PASTE : 224,
    },
    pub = {
        
        // URL for APIs
        API_URL_PREFIX : "http://api.art-of-coding.eu",
        
        // Version of this library.
        VERSION : {
            FLUX : "2.0.0",
            JQUERY : "1.7.1",
            ADMINTASIA : "2.1",
        },
    
    };
    
    /*
     * Create and return a XMLHttpRequest object.
     */
    pub.makeHttpRequest = function() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            return new ActiveXObject("MsXml2.XmlHttp");
        }
    };
    
    /*
     * Get a page with asynchronous HTTP request. Uses this.includeJavaScript().
     * @param url URL to fetch.
     */
    pub.ajaxPage = function(url) {
        var xmlHttp = this.getHttpRequest();
        xmlHttp.onReadyStateChange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200 || xmlHttp.status == 304) {
                    this.includeJavaScript(xmlHttp.responseText);
                } else {
                    alert('XML request error with ' + url + ': '
                            + xmlHttp.statusText + ' (' + xmlHttp.status + ')');
                }
            }
        };
        xmlHttp.open('GET', url, true);
        xmlHttp.send(null);
    };
    
    /*
     * Include a JavaScript as source code in the page.
     * @param url The URL the source was fetched from.
     * @param source Source code to include in a script tag.
     */
    pub.includeJavaScript = function(source) {
        if (source != null) {
            var script = document.createElement("script");
            script.language = "JavaScript";
            script.type = "text/javascript";
            //script.defer = true;
            script.text = source;
            var head = document.getElementsByTagName('head').item(0);
            head.appendChild(script);
        }
    };
    
    /*
     * Load a script.
     * @param url URL to load script from.
     */
    pub.loadScript = function(url, callback) {
        var script = document.createElement('script');
        script.language = 'JavaScript';
        script.type = 'text/javascript';
        script.src = url;
        if (callback) {
            // IE
            script.onReadyStateChange = function() {
                if (this.readyState == 'loaded'
                        || this.readyState == 'complete')
                    callback();
            };
            // All other
            script.onload = function() {
                if (callback)
                    callback();
            };
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    },

    /*
     * Load all needed JavaScripts, starting at 'idx' and call 'callback' when finished.
     */
    pub.loadScripts = function(scripts, idx, callback) {
        if (!idx)
            idx = 0;
        // Load next script
        if (idx < scripts.length) {
            //DEBUG console.log("FLUX.loadScripts: idx="+idx);
            FLUX.loadScript(scripts[idx], function() {
                FLUX.loadScripts(scripts, ++idx, callback);
            });
        } else {
            // We loaded all scripts, execute callback
            if (callback)
                callback();
        }
    };
    
    /*
     * Load JavaScripts needed to initialize Flux.
     * @param callback Callback to call when initialization has finished.
     */
    pub.init = function(callback) {
        // Initialize UI after initialization completed
        var myCallback = function() {
            if (callback)
                callback();
            // Show page
            jQuery("#page_wrapper").show();
        };
        // Load jQuery
        this.loadScript(this.META.JQUERY_URL);
        // Load Flux scripts
        this.loadScript(this.META.FLUX_URL + "/flux.log.js");
        this.loadScript(this.META.FLUX_URL + "/flux.tools.js");
        this.loadScript(this.META.FLUX_URL + "/flux.fastms.js");
        this.loadScript(this.META.FLUX_URL + "/flux.ui.js", function() {
            FLUX.UI.init(myCallback);
        });
    };
    
    // Return public object;
    return pub;
    
};
//Initialize with jQuery
if (typeof jQuery !== 'undefined') {
    FLUX = FLUX(jQuery);
} else {
    alert('Could not initialize FLUX: jQuery not loaded.');
}

/*!
 * Flux
 * jQuery Extras.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
var FLUX = FLUX || {};
FLUX.JQUERY = function($) {
    
    var pub = {};
    
    /*
     * Initialize jQuery extras.
     */
    pub.init = function() {
        // insertAtCaret
        jQuery.fn.extend({
            insertAtCaret: function(myValue) {
                return this.each(function(i) {
                    if (document.selection) {
                        this.focus();
                        sel = document.selection.createRange();
                        sel.text = myValue;
                        this.focus();
                    } else if (this.selectionStart || this.selectionStart == '0') {
                        var startPos = this.selectionStart;
                        var endPos = this.selectionEnd;
                        var scrollTop = this.scrollTop;
                        this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
                        this.focus();
                        this.selectionStart = startPos + myValue.length;
                        this.selectionEnd = startPos + myValue.length;
                        this.scrollTop = scrollTop;
                    } else {
                        this.value += myValue;
                        this.focus();
                    }
                });
            }
        });
    };
    
    // Return public object
    return pub;
    
};

/*!
 * Flux
 * Logging.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.LOG = function($) {
        
    var pub = {};
    
    /*
     *
     */
    this._wrConsole = function(msg) {
        console.log(new Date().toLocaleString() + " " + msg);
    };
    
    /*
     * Log a debug message.
     */
    pub.debug = function(msg) {
        //var a = this.debug.arguments;
        this._wrConsole("  DEBUG: " + msg);
    };
    
    /*
     * Log an error message.
     */
    pub.error = function(msg) {
        this._wrConsole("  ERROR: " + msg);
    };
    
    /*
     * Log a warning message.
     */
    pub.warning = function(msg) {
        this._wrConsole("WARNING: " + msg);
    };
    
    /*
     * Log an informational message.
     */
    pub.info = function(msg) {
        this._wrConsole("   INFO: " + msg);
    };
    
    // Return public object
    return pub;
    
};

/*!
 * Flux
 * JavaScript tools.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.TOOLS = function($) {
    
    var pub = {};
    
    /*
     * Merge two JavaScript objects.
     * Example with a simple map:
     *    var a = {a: 1};
     *    var b = {a: 2, b: 3};
     *    var c = a.merge(b);
     *    c == {a: 2, b: 3}
     */
    /*
    Object.prototype.merge: function(ob) {
        var o = this;
        var i = 0;
        for (var z in ob) {
            if (ob.hasOwnProperty(z)) {
                o[z] = ob[z];
            }
        }
        return o;
    };
    */
    
    /*
     * Merge two JavaScript objects: copy all properties of b to a.
     * Example with a simple map:
     *    var a = {a: 1};
     *    var b = {a: 2, b: 3};
     *    var c = merge(a, b);
     *    c == {a: 2, b: 3}
     */
    pub.merge = function(a, b) {
        for (z in b) {
            a[z] = b[z];
        }
        return a;
    };
    
    // Return public object
    return pub;
    
};
