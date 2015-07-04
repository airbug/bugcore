/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('If')

//@Require('Assertion')
//@Require('Class')
//@Require('Collections')
//@Require('Flow')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Assertion       = bugpack.require('Assertion');
    var Class           = bugpack.require('Class');
    var Collections     = bugpack.require('Collections');
    var Flow            = bugpack.require('Flow');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Flow}
     */
    var If = Class.extend(Flow, {

        _name: "If",


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
             * @type {Assertion}
             */
            this.assertionFlow          = null;

            /**
             * @private
             * @type {FlowBuilder}
             */
            this.assertPassFlowBuilder  = null;

            /**
             * @private
             * @type {FlowBuilder}
             */
            this.elseFlowBuilder        = null;

            /**
             * @private
             * @type {number}
             */
            this.elseIfIndex            = -1;

            /**
             * @private
             * @type {List.<IfBuilder>}
             */
            this.elseIfBuilderList      = Collections.list();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Flow, *...)} assertionMethod
         * @param {FlowBuilder} assertPassFlowBuilder
         * @return {If}
         */
        init: function(assertionMethod, assertPassFlowBuilder) {
            this._super();
            this.assertionFlow          = new Assertion(assertionMethod);
            this.assertPassFlowBuilder  = assertPassFlowBuilder;
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {FlowBuilder}
         */
        getElseFlowBuilder: function() {
            return this.elseFlowBuilder;
        },

        /**
         * @param {FlowBuilder} elseFlowBuilder
         */
        setElseFlowBuilder: function(elseFlowBuilder) {
            if (this.elseFlowBuilder) {
                throw Throwables.bug("IllegalState", {}, "IfFlow already has an ElseFlowBuilder");
            }
            this.elseFlowBuilder = elseFlowBuilder;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {(Array.<IfBuilder> | ICollection.<IfBuilder>)} elseIfFlowBuilders
         */
        addAllElseIfBuilders: function(elseIfFlowBuilders) {
            if (this.elseFlowBuilder) {
                throw Throwables.bug("IllegalState", {}, "IfFlow already has an ElseFlowBuilder");
            }
            this.elseIfBuilderList.addAll(elseIfFlowBuilders);
        },

        /**
         * @param {IfBuilder} elseIfBuilder
         */
        addElseIfBuilder: function(elseIfBuilder) {
            if (this.elseFlowBuilder) {
                throw Throwables.bug("IllegalState", {}, "IfFlow already has an ElseFlowBuilder");
            }
            this.elseIfBuilderList.add(elseIfBuilder);
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} flowArgs
         */
        executeFlow: function(flowArgs) {
            this._super(flowArgs);
            var _this = this;
            this.assertionFlow.execute(this.getFlowArgs(), function(error, result) {
                if (!error) {
                    if (result) {
                        _this.assertPassFlowBuilder.execute(_this.getFlowArgs(), function (throwable) {
                            _this.complete(throwable, result);
                        });
                    } else {
                        _this.nextElseFlow();
                    }
                } else {
                    _this.error(error);
                }
            });
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Error} error
         * @param {boolean} result
         */
        elseIfCallback: function(error, result) {
            if (!error) {
                if (result) {
                    this.complete(null, true);
                } else {
                    this.nextElseFlow();
                }
            } else {
                this.error(error);
            }
        },

        /**
         * @private
         */
        nextElseFlow: function() {
            var _this = this;
            if (this.elseIfBuilderList.getCount() > 0 && this.elseIfIndex < this.elseIfBuilderList.getCount()) {
                this.elseIfIndex++;
                var elseIfFlowBuilder = this.elseIfBuilderList.getAt(this.elseIfIndex);
                elseIfFlowBuilder.execute(this.getFlowArgs(), function(error, result) {
                    _this.elseIfCallback(error, result);
                });
            } else if (this.elseFlowBuilder) {
                this.elseFlowBuilder.execute(this.getFlowArgs(), function(error) {
                    _this.complete(error, false);
                });
            } else {
                this.complete(null, false);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('If', If);
});
