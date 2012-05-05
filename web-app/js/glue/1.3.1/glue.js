/*
 * Glue.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE = {
    
    // URL for APIs
    API_URL_PREFIX: "http://api.art-of-coding.eu",
        
    // Version of this library.
    VERSION: {
        GLUE: "1.3.1",
        JQUERY: "1.4.4",
        ADMINTASIA: "2.1",
    },
        
    /*
     * Return a XMLHttpRequest object.
     */
    getHttpRequest: function() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            return new ActiveXObject("MsXml2.XmlHttp");
        }
    },
    
    /*
     * Get a page with asynchronous HTTP request. Uses this.includeJavaScript().
     * @param url URL to fetch.
     */
    ajaxPage: function(url) {
        var xmlHttp = this.getHttpRequest();
        xmlHttp.onReadyStateChange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200 || xmlHttp.status == 304) {
                    this.includeJavaScript(url, xmlHttp.responseText);
                } else {
                    alert('XML request error with ' + url + ': ' + xmlHttp.statusText + ' (' + xmlHttp.status + ')');
                }
            }
        }
        xmlHttp.open('GET', url, true);
        xmlHttp.send(null);
    },
    
    /*
     * Include a JavaScript as source code in the page.
     * @param url The URL the source was fetched from.
     * @param source Source code to include in a script tag.
     */
    includeJavaScript: function(url, source) {
        if (source != null) {
            var script = document.createElement("script");
            script.language = "JavaScript";
            script.type = "text/javascript";
            script.defer = true;
            script.text = source;
            var head = document.getElementsByTagName('head').item(0);
            head.appendChild(script);
        }
    },
    
    /*
     * Load a script.
     * @param url URL to load script from.
     */
    loadScript: function(url, callback) {
        var script = document.createElement('script');
        script.language = 'JavaScript';
        script.type = 'text/javascript';
        script.src = url;
        if (callback) {
            // IE
            script.onReadyStateChange = function() {
                if (this.readyState == 'loaded' || this.readyState == 'complete') callback();
            }
            // All other
            script.onload = function() {
                if (callback) callback();
            }
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(script);
    },
    
    /*
     * Load all needed JavaScripts, starting at 'idx' and call 'callback' when finished.
     */
    loadScripts: function(scripts, idx, callback) {
        if (!idx) idx = 0;
        if (idx < scripts.length) {
            console.log("GLUE.loadScripts: idx="+idx);
            GLUE.loadScript(scripts[idx], function() { GLUE.loadScripts(scripts, ++idx, callback) });
        } else {
            if (callback) callback();
        }
    },
    
    /*
     * Load JavaScripts needed to initialize Glue.
     * @param callback Callback to call when initialization has finished.
     */
    init: function(callback) {
        // Load jQuery
        this.loadScript(this.META.JQUERY_URL);
        // Load Glue scripts
        this.loadScript(this.META.GLUE_URL + "/glue.log.js");
        this.loadScript(this.META.GLUE_URL + "/glue.tools.js");
        this.loadScript(this.META.GLUE_URL + "/glue.ui.js", function() {
            //GLUE.UI.loadScripts(0, callback);
            // Initialize UI, passing callback to be called after initialization completed
            GLUE.UI.init(callback);
            // Show div page_wrapper
            jQuery("#page_wrapper").show(); 
        });
    },
    
}

/*
 * Glue Metadata.
 */
GLUE.META = {
    
    // URL prefix
    URL_PREFIX: GLUE.API_URL_PREFIX + "/glue",
    
    // URL to Glue libraries
    GLUE_URL: GLUE.API_URL_PREFIX + "/glue/" + GLUE.VERSION.GLUE + "/js",
    
    // Dependencies to other libraries
    JQUERY_URL: GLUE.API_URL_PREFIX + "/jquery/" + GLUE.VERSION.JQUERY + "/jquery.min.js",
    ADMINTASIA_URL: GLUE.API_URL_PREFIX + "/admintasia/" + GLUE.VERSION.ADMINTASIA + "/js",
    
}
