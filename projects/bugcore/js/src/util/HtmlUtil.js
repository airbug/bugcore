/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HtmlUtil')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('Url')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil     = bugpack.require('ArgUtil');
    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var Url         = bugpack.require('Url');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var HtmlUtil = Class.extend(Obj, {
        _name: "HtmlUtil"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    HtmlUtil.escapeHtml = function(value) {
        return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    /**
     * @static
     * @param {string} value
     * @param {function(string, Url)} replacerFunction
     * @return {string}
     */
    HtmlUtil.replaceUrls = function(value, replacerFunction) {
        var regex = /(((([A-Za-z]{3,9}:(?:\/\/)?)|\/\/)(?:[-;:&=\+\$,A-Za-z0-9]+@)?[A-Za-z0-9.-]+|(?:(?:\w*\.)+|[-;:&=\+\$,A-Za-z0-9]+@)[A-Za-z0-9.-]+)(:(?:[0-9]+))?((?:\/[\+~%\/.A-Za-z0-9-_]*)?(?:\?(?:[-\+=&;:%@.A-Za-z0-9_,]*))?(?:#(?:[A-Za-z0-9\/]*))?)?)/g;
        return value.replace(regex, function(match) {
            var url = Url.parse(match);
            return replacerFunction(match, url);
        });
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    HtmlUtil.stringToHtml = function(value) {
        var args = ArgUtil.process(arguments, [
            {name: "value", optional: false, type: "string"}
        ]);
        value       = args.value;
        var html    = HtmlUtil.escapeHtml(value);
        return HtmlUtil.newlineToBr(html);
    };

    /**
     * @static
     * @param {string} value
     * @return {string}
     */
    HtmlUtil.urlsToHtmlATags = function(value) {
        HtmlUtil.replaceUrls(value, function(match, url) {
            return '<a href="' + url.toString() + '">' + match + '</a>';
        });
    };

    /**
     * @static
     * @param {string} value
     * @param {boolean=} isXhtml
     * @return {string}
     */
    HtmlUtil.newlineToBr = function(value, isXhtml) {
        var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
        return (value + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HtmlUtil', HtmlUtil);
});
