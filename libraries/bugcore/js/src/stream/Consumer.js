/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Consumer')

//@Require('Bug')
//@Require('Class')
//@Require('IConsumer')
//@Require('ISupplier')
//@Require('Obj')
//@Require('Supplier')
//@Require('Throwables')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug         = bugpack.require('Bug');
    var Class       = bugpack.require('Class');
    var IConsumer   = bugpack.require('IConsumer');
    var ISupplier   = bugpack.require('ISupplier');
    var Obj         = bugpack.require('Obj');
    var Supplier    = bugpack.require('Supplier');
    var Throwables  = bugpack.require('Throwables');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @class
     * @extends {Obj}
     * @implements {IConsumer.<I>}
     * @template I
     */
    var Consumer = Class.extend(Obj, {

        _name: "Consumer",


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
             * @type {function(Throwable, *)}
             */
            this.callback       = null;

            /**
             * @private
             * @type {boolean}
             */
            this.consuming      = false;

            /**
             * @private
             * @type {boolean}
             */
            this.ended          = false;

            /**
             * @private
             * @type {ISupplier.<I>}
             */
            this.supplier       = null;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ISupplier.<I>} supplier
         * @return {Consumer}
         */
        init: function(supplier) {
            this._super();
            if (Class.doesImplement(supplier, ISupplier)) {
                this.supplier = supplier;
            } else {
                throw Throwables.illegalArgumentBug("supplier", supplier, "'supplier' must implement ISupplier");
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getConsuming: function() {
            return this.consuming;
        },

        /**
         * @return {boolean}
         */
        getEnded: function() {
            return this.ended;
        },

        /**
         * @return {ISupplier.<I>}
         */
        getSupplier: function() {
            return this.supplier;
        },


        //-------------------------------------------------------------------------------
        // Alias Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isConsuming: function() {
            return this.consuming;
        },

        /**
         * @return {boolean}
         */
        isEnded: function() {
            return this.ended;
        },


        //-------------------------------------------------------------------------------
        // ISupplier Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        accept: function(item) {
            this.doAccept(item);
        },

        /**
         * @param {function(Throwable, *=)} callback
         */
        consume: function(callback) {
            if (!this.isConsuming()) {
                this.consuming  = true;
                this.callback   = callback;
                if (!this.supplier.isStarted()) {
                    this.supplier.supply(Supplier.Mode.ASYNC);
                } else {
                    if (this.supplier.getMode() !== Supplier.Mode.ASYNC) {
                        return callback(new Exception("IllegalState", {}, "Supplier is already supplying in SYNC mode. Cannot switch to ASYNC once started."));
                    }
                }
            } else {
                return callback(new Exception("IllegalState", {}, "Consumer is already consuming"));
            }
        },

        /**
         * @return {*}
         */
        consumeSync: function() {
            if (!this.isConsuming()) {
                this.consuming  = true;
                if (!this.supplier.isStarted()) {
                    this.supplier.supply(Supplier.Mode.SYNC);
                } else {
                    if (this.supplier.getMode() !== Supplier.Mode.SYNC) {
                        throw new Exception("IllegalState", {}, "Supplier is already supplying in ASYNC mode. Cannot switch to SYNC once started.");
                    }
                }
                if (!this.isEnded()) {
                    throw new Exception("IllegalState", {}, "Consumer did not receive end call");
                }
                return this.doConsume();
            } else {
                throw new Exception("IllegalState", {}, "Consumer is already consuming");
            }
        },

        /**
         *
         */
        end: function() {
            if (!this.isEnded()) {
                this.doEnd();
            } else {
                throw new Exception("IllegalState", {}, "Consumer already ended");
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        doEnd: function() {
            this.ended = true;
            if (this.supplier.getMode() === Supplier.Mode.ASYNC) {
                this.callback(null, this.doConsume());
            }
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {I} item
         */
        doAccept: function(item) {
            throw new Bug("AbstractMethod", {}, "Abstract method doAccept has not been implemented");
        },

        /**
         * @abstract
         * @return {*}
         */
        doConsume: function() {
            throw new Bug("AbstractMethod", {}, "Abstract method doConsume has not been implemented");
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Consumer, IConsumer);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Consumer', Consumer);
});
