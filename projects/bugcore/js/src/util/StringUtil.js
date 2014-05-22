/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StringUtil')

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
    var StringUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.capitalize = function(value) {
        var strings = value.split(" ");
        var result;
        if (strings.map) {
            result = strings.map(function(string, index, array) {
                return string[0].toUpperCase() + string.substring(1);
            });
        } else {
            result = [];
            strings.forEach(function(string){
                result.push(string[0].toUpperCase() + string.substring(1));
            });
        }
        return result.join(" ");
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.escapeString = function(value) {
        return (value + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    };

    /**
     * @static
     * @param {string} value
     * @param {string} pad
     * @param {number} size
     * @return {string}
     */
    StringUtil.pad = function(value, pad, size) {
        // Ensure string
        var result = value + "";
        while (result.length < size) {
            result = pad + result;
        }
        return result;
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.pluralize = function(value) {
        //TODO also add irregular patterns
        var irregularPlurals = {
            winklevoss: "winklevii"
        };
        if (irregularPlurals[value]) {
            return irregularPlurals[value]
        } else {
            return value + "s";
        }
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.trim = function(value) {
        var result = "";
        if (TypeUtil.isFunction(value.trim)) {
            result = value.trim();
        } else {
            result = value.replace(/^\s+|\s+$/g, '');
        }
        return result;
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.uncapitalize = function(value) {
        var strings = value.split(" ");
        var result;
        if (strings.map) {
            result = strings.map(function(string, index, array) {
                return string[0].toLowerCase() + string.substring(1);
            });
        } else {
            result = [];
            strings.forEach(function(string) {
                result.push(string[0].toLowerCase() + string.substring(1));
            });
        }
        return result.join(" ");
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('StringUtil', StringUtil);
});
