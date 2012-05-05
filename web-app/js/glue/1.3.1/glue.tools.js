/*
 * JavaScript tools.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.TOOLS = {
    
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
    merge: function(a, b) {
        for (z in b) {
            a[z] = b[z];
        }
        return a;
    },
    
}
