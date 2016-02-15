/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArrayUtil')

//@Require('FunctionUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var FunctionUtil    = bugpack.require('FunctionUtil');
    var TypeUtil        = bugpack.require('TypeUtil');


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
     * @param {Array} array
     * @param {function(*, number):*} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=
     * }=} options
     * @return {Array}
     */
    ArrayUtil.for = function(array, iteratee, options) {
        return ArrayUtil.iterate(array, iteratee, options);
    };

    /**
     * @static
     * @param {Array} array
     * @param {function(*, number):*} iteratee
     * @param {{
     *  context: Object=
     * }=} options
     * @return {Array}
     */
    ArrayUtil.forEach = function(array, iteratee, options) {
        return ArrayUtil.for(array, iteratee, options);
    };

    /**
     * @static
     * @param {Array} array
     * @param {function(number, *):*} iteratee
     * @param {{
     *  context: Object=
     * }=} options
     * @return {Array}
     */
    ArrayUtil.forIn = function(array, iteratee, options) {
        return ArrayUtil.for(array, iteratee, ArrayUtil.options(options, {in: true}));
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

    /**
     * NOTE BRN: If a property is modified in one iteration and then visited at a later time, its value in the loop is
     * its value at that later time. A property that is deleted before it has been visited will not be visited later.
     * Properties added to the object over which iteration is occurring may either be visited or omitted from iteration.
     * In general it is best not to add, modify or remove properties from the object during iteration, other than the
     * property currently being visited. There is no guarantee whether or not an added property will be visited, whether
     * a modified property (other than the current one) will be visited before or after it is modified, or whether a
     * deleted property will be visited before it is deleted.
     *
     * @static
     * @param {Array} array
     * @param {function(*, number):*} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=
     * }=} options
     * @return {Array}
     */
    ArrayUtil.iterate = function(array, iteratee, options) {
        if (!TypeUtil.isArray(array)) {
            throw new TypeError("'array' must be an Array");
        }
        if (!iteratee || (iteratee && !iteratee.call)) {
            throw new Error('Iterator function is required');
        }

        options = ArrayUtil.options(options);
        for (var i = 0, size = array.length; i < size; i++) {
            var args = options.in ? [i, array[i]] : [array[i], i];
            var result = FunctionUtil.apply(iteratee, options.context, args.concat(array));
            if (result === false) {
                break;
            }
        }
        return array;
    };


    //-------------------------------------------------------------------------------
    // Static Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @param {Object=} options
     * @param {Object=} overrides
     * @returns {Object}
     */
    ArrayUtil.options = function(options, overrides) {
        options = options || {};
        for (var key in overrides) {
            options[key] = overrides[key];
        }
        return options;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ArrayUtil', ArrayUtil);
});
