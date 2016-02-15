/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DataUtil')

//@Require('ArrayUtil')
//@Require('FunctionUtil')
//@Require('ObjectUtil')
//@Require('StringUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArrayUtil       = bugpack.require('ArrayUtil');
    var FunctionUtil    = bugpack.require('FunctionUtil');
    var ObjectUtil      = bugpack.require('ObjectUtil');
    var StringUtil      = bugpack.require('StringUtil');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     */
    var DataUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):boolean} predicate
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @return {boolean}
     */
    DataUtil.any = function(iterable, predicate, options) {
        var found = false;
        DataUtil.iterate(iterable, function() {
            found = !!FunctionUtil.apply(predicate, options ? options.context: null, arguments);
            return !found;
        }, options);
        return found;
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function((string | number), *):boolean} predicate
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {boolean}
     */
    DataUtil.anyEach = function(iterable, predicate, options) {
        return DataUtil.any(iterable, predicate, options);
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function((string | number), *):boolean} predicate
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {boolean}
     */
    DataUtil.anyIn = function(iterable, predicate, options) {
         return DataUtil.any(iterable, predicate, DataUtil.options(options, {in: true}));
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number))} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @returns {(Object | Array)}
     */
    DataUtil.for = function(iterable, iteratee, options) {
        return DataUtil.iterate(iterable, iteratee, options);
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number))} iteratee
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @returns {(Object | Array)}
     */
    DataUtil.forEach = function(iterable, iteratee, options) {
        return DataUtil.for(iterable, iteratee, options);
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function((string | number), *)} iteratee
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @returns {(Object | Array)}
     */
    DataUtil.forIn = function(iterable, iteratee, options) {
        return DataUtil.for(iterable, iteratee, DataUtil.options(options, {in: true}));
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, *)} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @returns {(Object | Array)}
     */
    DataUtil.iterate = function(iterable, iteratee, options) {
        if (TypeUtil.isArray(iterable)) {
            return ArrayUtil.iterate(iterable, iteratee, options);
        } else if (TypeUtil.isObjectLike(iterable)) {
            return ObjectUtil.iterate(iterable, iteratee, options);
        } else {
            throw new TypeError('iterable must be an Array or an Object');
        }
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):*} iteratee
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @return {Array.<*>}
     */
    DataUtil.map = function(iterable, iteratee, options) {
        var map = [];
        DataUtil.iterate(iterable, function() {
            map.push(FunctionUtil.apply(iteratee, options ? options.context: null, arguments));
        }, options);
        return map;
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):*} iteratee
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {Array.<*>}
     */
    DataUtil.mapEach = function(iterable, iteratee, options) {
        return DataUtil.map(iterable, iteratee, options);
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):*} iteratee
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {Array.<*>}
     */
    DataUtil.mapIn = function(iterable, iteratee, options) {
        return DataUtil.map(iterable, iteratee, DataUtil.options(options, {in: true}));
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):*} iteratee
     * @param {*} accumulator
     * @param {{
     *  context: Object=,
     *  in: boolean=,
     *  own: boolean=
     * }=} options
     * @return {*}
     */
    DataUtil.reduce = function(iterable, iteratee, accumulator, options) {
        DataUtil.iterate(iterable, function() {
            accumulator = FunctionUtil.apply(iteratee, options ? options.context: null, [accumulator].concat(arguments));
        }, options);
        return accumulator;
    };

    /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):*} iteratee
     * @param {*} accumulator
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {*}
     */
    DataUtil.reduceEach = function(iterable, iteratee, accumulator, options) {
        return DataUtil.reduce(iterable, iteratee, accumulator, options);
    };

      /**
     * @static
     * @param {(Object | Array)} iterable
     * @param {function(*, (string | number)):*} iteratee
     * @param {*} accumulator
     * @param {{
     *  context: Object=,
     *  own: boolean=
     * }=} options
     * @return {*}
     */
    DataUtil.reduceIn = function(iterable, iteratee, accumulator, options) {
        return DataUtil.reduce(iterable, iteratee, accumulator, DataUtil.options(options, {in: true}));
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
    DataUtil.options = function(options, overrides) {
        return ObjectUtil.assign({}, options, overrides);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('DataUtil', DataUtil);
});
