/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('FilterOperation')

//@Require('Class')
//@Require('IStreamOperation')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IStreamOperation    = bugpack.require('IStreamOperation');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IStreamOperation.<I>}
     * @template I
     */
    var FilterOperation = Class.extend(Obj, {

        _name: "FilterOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(I):boolean} filterMethod
         */
        _constructor: function(filterMethod) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(I):boolean}
             */
            this.filterMethod   = filterMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(I):boolean}
         */
        getFilterMethod: function() {
            return this.filterMethod;
        },


        //-------------------------------------------------------------------------------
        // IStreamOperation Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Stream} stream
         * @param {I} item
         */
        execute: function(stream, item) {
            var result = this.filterMethod(item);
            if (result) {
                stream.push(item);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(FilterOperation, IStreamOperation);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('FilterOperation', FilterOperation);
});
