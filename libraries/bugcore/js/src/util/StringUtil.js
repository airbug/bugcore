/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StringUtil')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var StringUtil = Class.extend(Obj, {
        _name: 'StringUtil'
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.camelCase = function(value) {
        return StringUtil.lowerFirst(
            StringUtil.words(value)
            .map(StringUtil.capitalize)
            .join('')
        );
    };

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
     * @param {string} string
     * @return {boolean}
     */
    StringUtil.contains = function(value, string) {
        if (!TypeUtil.isString(value)) {
            throw new TypeError( "'value' must be an String");
        }
        if (!TypeUtil.isString(string)) {
            throw new TypeError( "'string' must be an String");
        }
        return value.indexOf(string) > -1;
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.escapeRegExp = function(value) {
        return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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
    StringUtil.lpad = function(value, pad, size) {
        var result = value + "";
        while (result.length < size) {
            result = pad + result;
        }
        return result;
    };

    /**
     * @static
     * @param {string} value
     * @param {string} separator
     * @return {string}
     */
    StringUtil.lowerCamelToSeparator = function(value, separator) {
        return value
            .replace(/([A-Z])([A-Z])/g, "$1" + separator + ("$2"))
            .replace(/([a-z\d])([A-Z])/g, "$1" + separator + ("$2"))
            .toLowerCase();
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    StringUtil.lowerFirst = function(value) {
        value = StringUtil.toString(value);
        var char = value.charAt(0);
        return char.toLowerCase() + value.substr(1);
    };

    /**
     * @static
     * @param {string} value
     * @param {string=} chars
     * @return {string}
     */
    StringUtil.ltrim = function(value, chars) {
        chars = chars || "\\s";
        return value.replace(new RegExp("^[" + chars + "]+", "g"), "");
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
            result = pad + result + pad;
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
     * @param {string} search
     * @param {string} replacement
     * @return {string}
     */
    StringUtil.replaceAll = function(value, search, replacement) {
        return value.replace(new RegExp(StringUtil.escapeRegExp(search), 'g'), replacement);
    };

    /**
     * @static
     * @param {string} value
     * @param {string} pad
     * @param {number} size
     * @return {string}
     */
    StringUtil.rpad = function(value, pad, size) {
        var result = value + "";
        while (result.length < size) {
            result = result + pad;
        }
        return result;
    };

    /**
     * @static
     * @param {string} value
     * @param {string=} chars
     * @return {string}
     */
    StringUtil.rtrim = function(value, chars) {
        chars = chars || "\\s";
        return value.replace(new RegExp("[" + chars + "]+$", "g"), "");
    };

    /**
     * @static
     * @param {string} value
     * @param {string} separator
     * @param {(function(string, number, Array.<string>):*)=} lineProcessor
     * @return {Array.<string>}
     */
    StringUtil.split = function(value, separator, lineProcessor) {
        var lines = value.split(separator);
        if (lineProcessor) {
            lines = lines.map(lineProcessor);
        }
        return lines;
    };

    /**
     * @static
     * @param {*} value
     * @return {string}
     */
    StringUtil.toString = function(value) {
        if (TypeUtil.isString(value)) {
            return value;
        }
        if (value == null) {
            return '';
        }
        if (TypeUtil.isSymbol(value)) {
            return Symbol ? Symbol.prototype.toString.call(value) : '';
        }
        var result = (value + '');
        return (result == '0' && (1 / value) == -Infinity) ? '-0' : result;
    };

    /**
     * @static
     * @param {string} value
     * @param {string=} chars
     * @return {string}
     */
    StringUtil.trim = function(value, chars) {
        chars = chars || "\\s";
        return value.replace(new RegExp("^[" + chars + "]+|[" + chars + "]+$", "g"), "");
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

    /**
     * @static
     * @param {string} value
     * @param {RegExp=} pattern
     * @return {Array.<string>}
     */
    StringUtil.words = function(value, pattern) {
        pattern = pattern || StringUtil.wordRegex;
        return value.match(pattern);
    };


    //-------------------------------------------------------------------------------
    // Private Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @static
     * @type {RegExp}
     */
    StringUtil.wordRegex = /([0-9]+)|([a-zA-Z]+)/g;


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('StringUtil', StringUtil);
});
