/*
 * Data API.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.UI.DATA = {
    
    user: "",
    
    /* We have to submit this within a request */
    requestMetadata: {
        _my: "who am i",
        _my_timestamp: "my actual timestamp",
        _my_rev: "my revision",
    },
    
    /* Just informational: read-only values */
    documentMetadata: {
        _created_at: "",
        _created_by: "",
        _last_modified_at: "",
        _last_modified_by: "",
        _revision: "",
        _copyright: "",
    },
    
    /*
     * Initialize.
     * @param map A map: user.
     */
    init: function(map) {
        this.user = map.user;
    },
    
    /*
     * Fetch data: http://fast.ms/api_version/x/user/db/document_type/search_pattern
     * @param map A map: user, db, documentType
     * @param data Additional JSON data for request to fast.ms.
     */
    get: function(map, json) {
    },
    
    /*
     * Deliver data: http://fast.ms/api_version/x/user/db/document_type/_id=N
     * @param map A map: user, db, documentType
     * @param data JSON data for request to fast.ms.
     */
    put: function(map, json) {
    },

};
