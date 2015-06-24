/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ForEachParallel')

//@Require('Class')
//@Require('IIterable')
//@Require('IteratorFlow')
//@Require('MappedParallelException')
//@Require('Tracer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var IIterable                   = bugpack.require('IIterable');
    var IteratorFlow                = bugpack.require('IteratorFlow');
    var MappedParallelException     = bugpack.require('MappedParallelException');
    var Tracer                      = bugpack.require('Tracer');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $error                      = Tracer.$error;
    var $trace                      = Tracer.$trace;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {IteratorFlow}
     */
    var ForEachParallel = Class.extend(IteratorFlow, {

        _name: "ForEachParallel",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} data
         * @param {function(Flow, *)} iteratorMethod
         */
        _constructor: function(data, iteratorMethod) {

            this._super(data, iteratorMethod);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            if (Class.doesImplement(data, IIterable)) {
                throw new Error("ForEachParallel does not support IIterable instances. Use the IterableParallel instead.");
            }

            /**
             * @private
             * @type {MappedParallelException}
             */
            this.exception                  = null;

            /**
             * @private
             * @type {number}
             */
            this.numberIterationsComplete   = 0;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            var _this = this;
            if (this.getData().length > 0) {
                this.getData().forEach(function(value, index) {
                    _this.executeIteration([value, index]);
                });
            } else {
                this.complete();
            }
        },


        //-------------------------------------------------------------------------------
        // IteratorFlow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Throwable} throwable
         * @param {Array.<*>} args
         */
        iterationCallback: function(throwable, args) {
            this.numberIterationsComplete++;
            if (throwable) {
                this.processThrowable(throwable, args);
            }
            if (this.numberIterationsComplete >= this.getData().length) {
                if (!this.exception) {
                    this.complete();
                } else {
                    this.error(this.exception);
                }
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Throwable} throwable
         * @param {Array.<*>} args
         */
        processThrowable: function(throwable, args) {
            if (!this.exception) {
                this.exception = new MappedParallelException();
            }
            this.exception.putCause(args[0], throwable);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('ForEachParallel', ForEachParallel);
});
