/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RandomUtil')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var RandomUtil = Class.extend(Obj, {
        _name: "RandomUtil"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {number} firstInteger
     * @param {number} secondInteger
     * @return {number}
     */
    RandomUtil.randomBetween = function(firstInteger, secondInteger) {
        var delta = secondInteger - firstInteger;
        var randomNumber = Math.floor(Math.random() * (delta + 1));
        return randomNumber + firstInteger;
    };

    /**
     * @static
     * @param {number} digitLength
     * @return {string}
     */
    RandomUtil.randomHex = function(digitLength) {
        return Math.floor((1 + Math.random()) * Math.pow(16, digitLength))
            .toString(16)
            .substring(1);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('RandomUtil', RandomUtil);
});
