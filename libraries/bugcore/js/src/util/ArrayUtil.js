/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
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

    var TypeUtil    = bugpack.require('TypeUtil');


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
     * @param {Array.<*>} array
     * @param {number=} number
     */
    ArrayUtil.first = function(array, number) {
        if (!TypeUtil.isArray(array)) {
            throw new TypeError( "'array' must be an Array");
        }
        if (!TypeUtil.isNumber(number)) {
            number = 1;
        }
        return Array.prototype.slice.call(array, number);
    };

    /**
     * @static
     * @param {Array.<*>} array
     * @param {(* | RegExp | function(*, number))} search
     * @param {number=} fromIndex
     * @return {number}
     */
    ArrayUtil.indexOf = function(array, search, fromIndex) {
        if (!TypeUtil.isArray(array)) {
            throw new TypeError( "'array' must be an Array");
        }
        var length = array.length >>> 0; // Hack to convert object.length to a UInt32
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
                if (search(array[i])) {
                    return i;
                }
            }
        } else if (TypeUtil.isRegExp(search)) {
            for (; i < length; i++) {
                if (search.test(array[i])) {
                    return i;
                }
            }
        } else {
            for (; i < length; i++) {
                if (array[i] === search) {
                    return i;
                }
            }
        }
        return -1;
    };

    /**
     * @static
     * @param {Array} array
     * @return {boolean}
     */
    ArrayUtil.isEmpty = function(array) {
        if (!TypeUtil.isArray(array)) {
            throw new TypeError( "'array' must be an Array");
        }
        return array.length === 0;
    };

    /**
     * @static
     * @param {Array.<*>} array1
     * @param {Array.<*>} array2
     * @return {boolean}
     */
    ArrayUtil.isEqual = function(array1, array2) {
        if (!TypeUtil.isArray(array1)) {
            throw new TypeError( "'array1' must be an Array");
        }
        if (!TypeUtil.isArray(array2)) {
            throw new TypeError( "'array2' must be an Array");
        }
        if (array1 === array2) {
            return true;
        }
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0, size = array1.length; i < size; i++) {
            if (array1[i] !== array2[i])  {
                return false;
            }
        }
        return true;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArrayUtil', ArrayUtil);
});
