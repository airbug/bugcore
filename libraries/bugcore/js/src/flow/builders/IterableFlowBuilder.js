/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IterableFlowBuilder')

//@Require('Class')
//@Require('FlowBuilder')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var FlowBuilder     = bugpack.require('FlowBuilder');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {FlowBuilder}
     */
    var IterableFlowBuilder = Class.extend(FlowBuilder, {

        _name: "IterableFlowBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {(Array.<*>, Object.<string, *>, IIterable.<*>)}
             */
            this.data               = null;

            /**
             * @private
             * @type {function(IterableFlow, *...)}
             */
            this.iteratorMethod     = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(Array.<*>, Object.<string, *>, IIterable.<*>)} data
         * @param {function(ForEachParallel, *...)} iteratorMethod
         * @return {IterableFlowBuilder}
         */
        init: function(data, iteratorMethod) {
            if (TypeUtil.isArray(data) || TypeUtil.isObject(data)) {
                this.data = data;
            } else {
                throw Throwables.illegalArgumentBug("data", data, "must be an Array or an Object");
            }
            if (TypeUtil.isFunction(iteratorMethod)) {
                this.iteratorMethod = iteratorMethod;
            } else {
                throw Throwables.illegalArgumentBug("iteratorMethod", iteratorMethod, "must be a function");
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<*>|Object.<string, *>|IIterable.<*>}
         */
        getData: function() {
            return this.data;
        },

        /**
         * @return {function(IterableFlow, *)}
         */
        getIteratorMethod: function() {
            return this.iteratorMethod;
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IterableFlowBuilder', IterableFlowBuilder);
});
