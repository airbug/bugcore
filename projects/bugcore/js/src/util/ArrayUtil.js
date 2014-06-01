/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArrayUtil')

//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var TypeUtil = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     */
    var ArrayUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Array.<*>} value
     * @param {(* | RegExp | function(*, number))} search
     * @param {number} fromIndex
     * @return {number}
     */
    ArrayUtil.indexOf = function(value, search, fromIndex) {
        if (!TypeUtil.isArray(value)) {
            throw new TypeError( "'value' must be an Array");
        }
        var length = value.length >>> 0; // Hack to convert object.length to a UInt32
        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        var i = fromIndex;
        if (TypeUtil.isFunction(search)) {
            for (; i < length; i++) {
                if (search(value[i])) {
                    return i;
                }
            }
        } else if (search instanceof RegExp) {
            for (; i < length; i++) {
                if (search.test(value[i])) {
                    return i;
                }
            }
        } else {
            for (; i < length; i++) {
                if (value[i] === search) {
                    return i;
                }
            }
        }
        return -1;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArrayUtil', ArrayUtil);
});
