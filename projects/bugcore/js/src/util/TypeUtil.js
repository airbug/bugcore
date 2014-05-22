/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
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

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    // NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
    // and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.

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
    TypeUtil.isArray = function(value) {
        return value instanceof Array;
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isBoolean = function(value) {
        return (typeof value === 'boolean' || value instanceof Boolean);
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isDate = function(value) {
        return value instanceof Date;
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isFunction = function(value) {
        return typeof value === "function";
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
        return (typeof value === 'number' || value instanceof Number);
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isObject = function(value) {
        return TypeUtil.toType(value) === "object";
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isString = function(value) {
        return (typeof value === 'string' || value instanceof String);
    };

    /**
     * @static
     * @param {*} value
     * @return {boolean}
     */
    TypeUtil.isUndefined = function(value) {
        return value === undefined;
    };

    /**
     * @static
     * @param {*} value
     * @return {string}
     */
    TypeUtil.toType = function(value) {
        var type = typeof value;
        if (type === "object") {
            var objectType = Object.prototype.toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            var coreType = TypeUtil.coreTypes[objectType];
            return coreType || "object";
        }
        return type;
    };


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    TypeUtil.coreTypes = {
        array: "array",
        boolean: "boolean",
        date: "date",
        function: "function",
        null: "null",
        number: "number",
        string: "string",
        undefined: "undefined"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('TypeUtil', TypeUtil);
});
