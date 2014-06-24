/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachOperation')

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
    var ForEachOperation = Class.extend(Obj, {

        _name: "ForEachOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(I):*} iteratorMethod
         */
        _constructor: function(iteratorMethod) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(I)}
             */
            this.iteratorMethod     = iteratorMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {function(I)}
         */
        getIteratorMethod: function() {
            return this.iteratorMethod;
        },


        //-------------------------------------------------------------------------------
        // IStreamOperation Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Stream.<I>} stream
         * @param {I} item
         */
        execute: function(stream, item) {
            this.iteratorMethod(item);
            stream.push(item);
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ForEachOperation, IStreamOperation);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ForEachOperation', ForEachOperation);
});

