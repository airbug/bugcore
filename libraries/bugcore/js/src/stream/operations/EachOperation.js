/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('EachOperation')

//@Require('Class')
//@Require('IStreamOperation')
//@Require('Obj')
//@Require('TypeUtil')


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
    var TypeUtil            = bugpack.require('TypeUtil')


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IStreamOperation.<I>}
     * @template I
     */
    var EachOperation = Class.extend(Obj, {

        _name: "EachOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(I, Stream.<I>):*} iteratorMethod
         * @param {boolean=} blocking
         */
        _constructor: function(iteratorMethod, blocking) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.blocking           = TypeUtil.isBoolean(blocking) ? blocking : false;

            /**
             * @private
             * @type {function(I, Stream.<I>)}
             */
            this.iteratorMethod     = iteratorMethod;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getBlocking: function() {
            return this.blocking;
        },

        /**
         * @return {function(I, Stream.<I>)}
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
            this.iteratorMethod(item, stream);
            if (!this.blocking) {
                stream.push(item);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(EachOperation, IStreamOperation);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('EachOperation', EachOperation);
});

