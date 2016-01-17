/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Throwables')

//@Require('ArgumentBug')
//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('ParallelException')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var Obj                 = bugpack.require('Obj');
    var ParallelException   = bugpack.require('ParallelException');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Throwables = Class.extend(Obj, {
        _name: "Throwables"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} type
     * @param {*=} data
     * @param {string=} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @return {Bug}
     */
    Throwables.bug = function(type, data, message, causes) {
        return new Bug(type, data, message, causes);
    };

    /**
     * @static
     * @param {string} type
     * @param {*=} data
     * @param {string=} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @return {Exception}
     */
    Throwables.exception = function(type, data, message, causes) {
        return new Exception(type, data, message, causes);
    };

    /**
     * @static
     * @param {string} argName
     * @param {*} argValue
     * @param {string} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @return {ArgumentBug}
     */
    Throwables.illegalArgumentBug = function(argName, argValue, message, causes) {
        return new ArgumentBug(ArgumentBug.ILLEGAL, argName, argValue, message, causes);
    };

    /**
     * @static
     * @param {string=} type
     * @param {*=} data
     * @param {string=} message
     * @param {Array.<(Throwable | Error)>=} causes
     * @return {ParallelException}
     */
    Throwables.parallelException = function(type, data, message, causes) {
        return new ParallelException(type, data, message, causes);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Throwables', Throwables);
});
