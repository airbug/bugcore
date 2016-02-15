/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('FunctionUtil')

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
    var FunctionUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

     /**
     * @static
     * @param {function(...*):*} func
     * @param {Object} context
     * @param {Array.<*>} args
     * @return {*}
     */
    FunctionUtil.apply = function(func, context, args) {
        return Function.prototype.apply.call(func, context, args);
    };

    /**
     * @static
     * @param {function(...):*} func
     * @param {Object} context
     * @param {...} args
     * @return {*}
     */
    FunctionUtil.call = function(func, context) {
        var args = Array.prototype.slice.call(arguments, 0);
        func = args.shift();
        context = args.shift();
        return Function.prototype.apply.call(func, context, args);
    };

    /**
     * @static
     * @param {function(...):*} func
     * @return {string}
     */
    FunctionUtil.toName = function(func) {
        if (!TypeUtil.isFunction(func)) {
            throw new TypeError( "'func' must be an Function");
        }
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(func.toString());
        return (results && results.length > 1) ? results[1] : "";
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('FunctionUtil', FunctionUtil);
});
