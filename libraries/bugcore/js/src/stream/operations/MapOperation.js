/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MapOperation')

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
    var MapOperation = Class.extend(Obj, {

        _name: "MapOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(I):*} mapMethod
         */
        _constructor: function(mapMethod) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(I):*}
             */
            this.mapMethod  = mapMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(I):*}
         */
        getMapMethod: function() {
            return this.mapMethod;
        },


        //-------------------------------------------------------------------------------
        // IStreamOperation Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Stream} stream
         * @param {I} item
         */
        execute: function(stream, item) {
            var result = this.mapMethod(item);
            stream.push(result);
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MapOperation, IStreamOperation);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('MapOperation', MapOperation);
});
