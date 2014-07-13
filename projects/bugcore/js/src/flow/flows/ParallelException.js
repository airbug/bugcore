/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugflow may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ParallelException')

//@Require('Class')
//@Require('Exception')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Exception}
     */
    var ParallelException = Class.extend(Exception, {

        _name: "ParallelException",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {*=} data
         * @param {string=} message
         * @param {Array.<(Throwable | Error)>=} causes
         */
        _constructor: function(type, data, message, causes) {
            type = type ? type : "ParallelException";
            this._super(type, data, message, causes);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ParallelException', ParallelException);
});
