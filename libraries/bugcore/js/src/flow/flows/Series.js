/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Series')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Flow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil     = bugpack.require('ArgUtil');
    var Class       = bugpack.require('Class');
    var Flow        = bugpack.require('Flow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var Series = Class.extend(Flow, {

        _name: 'Series',


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
             * @type {boolean}
             */
            this.first              = true;

            /**
             * @private
             * @type {Array.<FlowBuilder>}
             */
            this.flowBuilderArray   = [];

            /**
             * @private
             * @type {number}
             */
            this.index              = -1;
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<FlowBuilder>} flowBuilderArray
         * @return {Series}
         */
        init: function(flowBuilderArray) {
            this._super();
            this.flowBuilderArray = flowBuilderArray;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            this.startNextFlow(flowArgs);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Throwable=} throwable
         */
        flowCallback: function(throwable) {
            var args = ArgUtil.toArray(arguments);
            args.shift();
            if (throwable) {
                this.error(throwable);
            } else  {
                this.startNextFlow(args);
            }
        },

        /**
         * @private
         * @param {Array.<*>} passedArgs
         */
        startNextFlow: function(passedArgs) {
            var _this = this;
            this.index++;
            if (this.index < this.flowBuilderArray.length) {
                var nextFlowBuilder = this.flowBuilderArray[this.index];
                nextFlowBuilder.execute(passedArgs, function() {
                    _this.flowCallback.apply(_this, arguments);
                });
            } else {
                this.complete.apply(this, [null].concat(passedArgs));
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Series', Series);
});
