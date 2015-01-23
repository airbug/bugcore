/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Throwables')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('ParallelException')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var ParallelException     = bugpack.require('ParallelException');
    var Obj             = bugpack.require('Obj');


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
