/*
 * Logging.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.LOG = {
    
    /*
     *
     */
    _wrConsole: function(msg) {
        console.log(new Date().toLocaleString() + " " + msg);
    },
    
    /*
     * Log a debug message.
     */
    debug: function(msg) {
        //var a = this.debug.arguments;
        this._wrConsole("  DEBUG: " + msg);
    },
    
    /*
     * Log an error message.
     */
    error: function(msg) {
        this._wrConsole("  ERROR: " + msg);
    },
    
    /*
     * Log a warning message.
     */
    warning: function(msg) {
        this._wrConsole("WARNING: " + msg);
    },
    
    /*
     * Log an informational message.
     */
    info: function(msg) {
        this._wrConsole("   INFO: " + msg);
    },
    
}
