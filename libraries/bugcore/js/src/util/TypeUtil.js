/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    // NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
    // and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.

    // NOTE BRN: the TypeUtil.toString(value)  === '[object SOME_TYPE]' method is cross frame compatible. Need to
    // figure out a way to write a test for this

    /**
     * @constructor
     */
    var TypeUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isArguments = function(value) {
        return TypeUtil.toString(value) === '[object Arguments]';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isArray = function(value) {
        return TypeUtil.toString(value) === '[object Array]';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isBoolean = function(value) {
        return (typeof value === 'boolean' || TypeUtil.toString(value) === '[object Boolean]');
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isDate = function(value) {
        return TypeUtil.toString(value) === '[object Date]';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isError = function(value) {
        return TypeUtil.toString(value) === '[object Error]';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isFunction = function(value) {
        return typeof value === 'function';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isNaN = function(value) {
        return (typeof value === 'number' && +value !== +value);
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isNull = function(value) {
        return value === null;
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isNumber = function(value) {
        return (typeof value === 'number' || TypeUtil.toString(value) === '[object Number]') && !TypeUtil.isNaN(value);
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isObject = function(value) {
        return TypeUtil.toType(value) === 'object';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isObjectLike = function(value) {
        return typeof value === 'object' && !TypeUtil.isNull(value);
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isRegExp = function(value) {
        return TypeUtil.toString(value) === '[object RegExp]';
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isString = function(value) {
        return (typeof value === 'string' || TypeUtil.toString(value) === '[object String]');
    };

    /**
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    TypeUtil.isSymbol = function(value) {
        return (typeof value === 'symbol' || TypeUtil.toString(value) === '[object Symbol]');
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isUndefined = function(value) {
        return value === void 0;
    };

    /**
     * @static
     * @param {*} value
     * @return {string}
     */
    TypeUtil.toString = function(value) {
        return Object.prototype.toString.call(value);
    };

    /**
     * @static
     * @param {*} value
     * @return {string}
     */
    TypeUtil.toType = function(value) {
        var type = typeof value;
        if (type === 'object') {
            var objectType = TypeUtil.toString(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            var coreType = TypeUtil.coreTypes[objectType];
            return coreType || 'object';
        } else if (type === 'number') {
            if (TypeUtil.isNaN(value)) {
                return 'nan';
            }
        }
        return type;
    };


    //-------------------------------------------------------------------------------
    // Static Private Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @enum {string}
     */
    TypeUtil.coreTypes = {
        arguments: 'arguments',
        array: 'array',
        boolean: 'boolean',
        date: 'date',
        error: 'error',
        function: 'function',
        null: 'null',
        number: 'number',
        regexp: 'regexp',
        string: 'string',
        symbol: 'symbol',
        undefined: 'undefined'
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('TypeUtil', TypeUtil);
});
