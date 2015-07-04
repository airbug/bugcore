/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IterableFlow')

//@Require('ArgUtil')
//@Require('ArrayIterator')
//@Require('Class')
//@Require('Flow')
//@Require('IIterable')
//@Require('Iteration')
//@Require('ObjectIterator')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil         = bugpack.require('ArgUtil');
    var ArrayIterator   = bugpack.require('ArrayIterator');
    var Class           = bugpack.require('Class');
    var Flow            = bugpack.require('Flow');
    var IIterable       = bugpack.require('IIterable');
    var Iteration       = bugpack.require('Iteration');
    var ObjectIterator  = bugpack.require('ObjectIterator');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var IterableFlow = Class.extend(Flow, {

        _name: "IterableFlow",


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
             * @type {Array.<*> | Object.<string, *> | IIterable.<*>}
             */
            this.data               = null;

            /**
             * @private
             * @type {IIterator}
             */
            this.iterator           = null;

            /**
             * @private
             * @type {function(IterableFlow, *...)}
             */
            this.iteratorMethod     = null;

            /**
             * @private
             * @type {Array.<*>}
             */
            this.returnedValues       = [];
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*> | Object.<string, *> | IIterable.<*>} data
         * @param {function(IterableFlow, *...)} iteratorMethod
         * @return {IterableFlow}
         */
        init: function(data, iteratorMethod) {
            this._super();
            this.data               = data;
            this.iteratorMethod     = iteratorMethod;
            if (Class.doesImplement(this.data, IIterable)) {
                this.iterator = this.data.iterator();
            } else if (TypeUtil.isArray(this.data)) {
                this.iterator = new ArrayIterator(this.data);
            } else if (TypeUtil.isObject(this.data)) {
                this.iterator = new ObjectIterator(this.data);
            } else {
                throw Throwables.illegalArgumentBug("data", data, "must be an Array, Object, or implement IIterable");
            }
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<*> | Object.<string, *> | IIterable.<*>}
         */
        getData: function() {
            return this.data;
        },

        /**
         * @return {IIterator}
         */
        getIterator: function() {
            return this.iterator;
        },

        /**
         * @return {function(IterableFlow, *...)}
         */
        getIteratorMethod: function() {
            return this.iteratorMethod;
        },

        /**
         * @return {Array.<*>}
         */
        getReturnedValues: function() {
            return this.returnedValues;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Throwable=} throwable
         * @param {*...} arguments
         */
        complete: function(throwable) {

            //TODO BRN: Do we need to handle extra args here?

            this._super(throwable, this.returnedValues);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} iterationArgs
         */
        executeIteration: function(iterationArgs) {
            var _this = this;
            var iteration = new Iteration(this.getIteratorMethod());
            iteration.execute((iterationArgs).concat(this.getFlowArgs()), function(throwable) {
                var returnedValues = ArgUtil.toArray(arguments);
                returnedValues.shift(); //Remove throwable
                _this.returnedValues.push(returnedValues);
                _this.iterationCallback(throwable, iteration);
            });
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {Throwable} throwable
         * @param {Iteration} iteration
         */
        iterationCallback: function(throwable, iteration) {
            throw Throwables.bug("AbstractMethodNotImplemented", {}, "Must implement iterationCallback");
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IterableFlow', IterableFlow);
});
