/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Stream')

//@Require('ArgUtil')
//@Require('Class')
//@Require('CollectConsumer')
//@Require('FilterOperation')
//@Require('ForEachOperation')
//@Require('Func')
//@Require('IConsumer')
//@Require('MapOperation')
//@Require('ReduceConsumer')
//@Require('Supplier')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var CollectConsumer     = bugpack.require('CollectConsumer');
    var FilterOperation     = bugpack.require('FilterOperation');
    var ForEachOperation    = bugpack.require('ForEachOperation');
    var Func                = bugpack.require('Func');
    var IConsumer           = bugpack.require('IConsumer');
    var MapOperation        = bugpack.require('MapOperation');
    var ReduceConsumer      = bugpack.require('ReduceConsumer');
    var Supplier            = bugpack.require('Supplier');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Supplier.<I>}
     * @implements {IConsumer.<I>}
     * @template I
     */
    var Stream = Class.extend(Supplier, {

        _name: "Stream",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ISupplier.<I>} supplier
         * @param {IStreamOperation} operation
         */
        _constructor: function(supplier, operation) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IStreamOperation}
             */
            this.operation  = operation;

            /**
             * @private
             * @type {ISupplier.<I>}
             */
            this.supplier   = supplier;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IStreamOperation}
         */
        getOperation: function() {
            return this.operation;
        },

        /**
         * @returns {ISupplier.<I>}
         */
        getSupplier: function() {
            return this.supplier;
        },


        //-------------------------------------------------------------------------------
        // IConsumer Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        accept: function(item) {
            if (this.operation) {
                this.operation.execute(this, item);
            } else {
                this.push(item);
            }
        },

        /**
         *
         */
        end: function() {
            this.doEnd();
        },


        //-------------------------------------------------------------------------------
        // Supplier Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Supplier.Mode} mode
         */
        doStart: function(mode) {
            this.supplier.supply(mode);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Constructor} constructor
         * @param {function(Throwable, Collection.<T>=)} callback
         * @template T
         */
        collect: function(constructor, callback) {
            var consumer = new CollectConsumer(this, constructor);
            this.addConsumer(consumer);

            // NOTE BRN: We defer this call here so that other stream consumers can have a chance to wire up before the
            // Consumer starts consuming.

            Func.deferCall(consumer.consume, consumer, callback);
        },

        /**
         * @param {Constructor} constructor
         * @param {boolean=} autoConsume
         * @return {(Collection.<T> | Consumer.<T>)}
         * @template T
         */
        collectSync: function(constructor, autoConsume) {
            var args = ArgUtil.process(arguments, [
                {name: "constructor", optional: false, type: "function"},
                {name: "autoConsume", optional: true, type: "boolean", 'default': true}
            ]);
            constructor     = args.constructor;
            autoConsume       = args.autoConsume;
            var consumer = new CollectConsumer(this, constructor);
            this.addConsumer(consumer);
            if (autoConsume) {
                return consumer.consumeSync();
            } else {
                return consumer;
            }
        },

        /**
         * @param {function(I):boolean} filterMethod
         * @return {Stream.<I>}
         */
        filter: function(filterMethod) {
            return Stream.generate(this, new FilterOperation(filterMethod));
        },

        /**
         * @param {function(I)} iteratorMethod
         * @return {Stream.<I>}
         */
        forEach: function(iteratorMethod) {
            return Stream.generate(this, new ForEachOperation(iteratorMethod));
        },

        /**
         * @param {function(I):*} mapMethod
         * @return {Stream.<*>}
         */
        map: function(mapMethod) {
            return Stream.generate(this, new MapOperation(mapMethod));
        },

        /**
         * @param {T} memo
         * @param {function(T, I):T} reduceMethod
         * @param {function(Throwable, T=)} callback
         * @template T
         */
        reduce: function(memo, reduceMethod, callback) {
            var consumer = new ReduceConsumer(this, memo, reduceMethod);
            this.addConsumer(consumer);

            // NOTE BRN: We defer this call here so that other stream consumers can have a chance to wire up before the
            // stream starts pushing.

            Func.deferCall(consumer.consume, consumer, callback);
        },

        /**
         * @param {T} memo
         * @param {function(T, I):T} reduceMethod
         * @param {boolean=} autoConsume
         * @return {(Collection.<T> | Consumer.<T>)}
         * @template T
         */
        reduceSync: function(memo, reduceMethod, autoConsume) {
            var args = ArgUtil.process(arguments, [
                {name: "memo", optional: false},
                {name: "reduceMethod", optional: false, type: "function"},
                {name: "autoConsume", optional: true, type: "boolean", 'default': true}
            ]);
            memo            = args.memo;
            reduceMethod    = args.reduceMethod;
            autoConsume     = args.autoConsume;
            var consumer = new ReduceConsumer(this, memo, reduceMethod);
            this.addConsumer(consumer);
            if (autoConsume) {
                return consumer.consumeSync();
            } else {
                return consumer;
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Stream, IConsumer);


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {ISupplier.<I>} supplier
     * @param {IStreamOperation=} operation
     * @returns {Stream.<I>}
     */
    Stream.generate = function(supplier, operation) {
        var stream = new Stream(supplier, operation);
        supplier.addConsumer(stream);
        return stream;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Stream', Stream);
});
