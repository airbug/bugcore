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
         * @param {function(Flow)} assertionMethod
         * @param {Flow} ifFlow
         */
        _constructor: function(assertionMethod, ifFlow) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Assertion}
             */
            this.assertionFlow      = new Assertion(assertionMethod);

            /**
             * @private
             * @type {Flow}
             */
            this.elseFlow           = null;

            /**
             * @private
             * @type {number}
             */
            this.elseIfIndex        = -1;

            /**
             * @private
             * @type {List.<If>}
             */
            this.elseIfList         = Collections.list();

            /**
             * @private
             * @type {Array.<*>}
             */
            this.execArgs           = null;

            /**
             * @private
             * @type {Flow}
             */
            this.ifFlow             = ifFlow;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @param {(Array.<If> | ICollection.<If>)} elseIfFlows
         */
        addAllElseIf: function(elseIfFlows) {
            if (this.elseFlow) {
                throw Throwables.bug("IllegalState", {}, "IfFlow already has an ElseFlow");
            }
            this.elseIfList.addAll(elseIfFlows);
        },

        /**
         * @param {If} elseIfFlow
         */
        addElseIf: function(elseIfFlow) {
            if (this.elseFlow) {
                throw Throwables.bug("IllegalState", {}, "IfFlow already has an ElseFlow");
            }
            this.elseIfList.add(elseIfFlow);
        },

        /**
         * @param {Flow} elseFlow
         */
        setElse: function(elseFlow) {
            if (this.elseFlow) {
                throw Throwables.bug("IllegalState", {}, "IfFlow already has an ElseFlow");
            }
            this.elseFlow = elseFlow;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array.<*>} args
         */
        executeFlow: function(args) {
            this._super(args);

            var _this = this;
            this.execArgs = args;
            this.assertionFlow.execute(this.execArgs, function(error, result) {
                if (!error) {
                    if (result) {
                        _this.ifFlow.execute(_this.execArgs, function (throwable) {
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
            if (this.elseIfList.getCount() > 0 && this.elseIfIndex < this.elseIfList.getCount()) {
                this.elseIfIndex++;
                var elseIfFlow = this.elseIfList.getAt(this.elseIfIndex);
                elseIfFlow.execute(this.execArgs, function(error, result) {
                    _this.elseIfCallback(error, result);
                });
            } else if (this.elseFlow) {
                this.elseFlow.execute(this.execArgs, function(error) {
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
