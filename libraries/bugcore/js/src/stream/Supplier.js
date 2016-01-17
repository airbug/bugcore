/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Supplier')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('IConsumer')
//@Require('ISupplier')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var IConsumer   = bugpack.require('IConsumer');
    var ISupplier   = bugpack.require('ISupplier');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @class
     * @extends {Obj}
     * @implements {ISupplier.<I>}
     * @template I
     */
    var Supplier = Class.extend(Obj, {

        _name: "Supplier",


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
             * @type {Array.<IConsumer>}
             */
            this.consumers      = [];

            /**
             * @private
             * @type {Supplier.Mode}
             */
            this.mode           = null;

            /**
             * @private
             * @type {boolean}
             */
            this.started        = false;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<IConsumer>}
         */
        getConsumers: function() {
            return this.consumers;
        },

        /**
         * @return {Supplier.Mode}
         */
        getMode: function() {
            return this.mode;
        },

        /**
         * @return {boolean}
         */
        getStarted: function() {
            return this.started;
        },


        //-------------------------------------------------------------------------------
        // Alias Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isStarted: function() {
            return this.started;
        },


        //-------------------------------------------------------------------------------
        // ISupplier Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IConsumer.<I>} consumer
         */
        addConsumer: function(consumer) {
            if (Class.doesImplement(consumer, IConsumer)) {
                this.consumers.push(consumer);
            } else {
                throw new Exception("IllegalArgument", {}, "Consumer must implement IConsumer");
            }
        },

        /**
         * @param {Supplier.Mode} mode
         */
        supply: function(mode) {
            if (!this.isStarted()) {
                this.mode = mode;
                this.doStart(mode);
            } else {
                throw new Exception("IllegalState", {}, "Supplier already started");
            }
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Supplier.Mode} mode
         */
        doStart: function(mode) {
            throw new Bug("AbstractMethod", {}, "Abstract method doStart has not been implemented");
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        push: function(item) {
            this.consumers.forEach(function(consumer) {
                consumer.accept(item);
            });
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        doEnd: function() {
            this.consumers.forEach(function(consumer) {
                consumer.end();
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Supplier, ISupplier);


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    Supplier.Mode = {
        ASYNC: "Supplier:Mode:Async",
        SYNC: "Supplier:Mode:Sync"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Supplier', Supplier);
});
