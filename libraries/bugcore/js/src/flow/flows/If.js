/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('If')

//@Require('Class')
//@Require('Flow')
//@Require('List')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Flow    = bugpack.require('Flow');
    var List    = bugpack.require('List');


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
         * @param {function(Flow)} ifMethod
         * @param {Flow} ifFlow
         */
        _constructor: function(ifMethod, ifFlow) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Flow}
             */
            this.elseFlow = null;

            /**
             * @private
             * @type {number}
             */
            this.elseIfIndex = -1;

            /**
             * @private
             * @type {List<If>}
             */
            this.elseIfList = new List();

            /**
             * @private
             * @type {function(Flow)}
             */
            this.ifMethod = ifMethod;

            /**
             * @private
             * @type {Flow}
             */
            this.ifFlow = ifFlow;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @param {(Array.<If> | ICollection.<If>)} elseIfFlows
         */
        addAllElseIf: function(elseIfFlows) {
            if (this.elseFlow) {
                throw new Error("IfFlow already has an ElseFlow");
            }
            this.elseIfList.addAll(elseIfFlows);
        },

        /**
         * @param {If} elseIfFlow
         */
        addElseIf: function(elseIfFlow) {
            if (this.elseFlow) {
                throw new Error("IfFlow already has an ElseFlow");
            }
            this.elseIfList.add(elseIfFlow);
        },

        /**
         * @param {Flow} elseFlow
         */
        setElse: function(elseFlow) {
            if (this.elseFlow) {
                throw new Error("IfFlow already has an ElseFlow");
            }
            this.elseFlow = elseFlow;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            this.execArgs = args;
            try {
                this.ifMethod.apply(null, ([this]).concat(args));
            } catch(throwable) {
                this.errorFlow(throwable);
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} bool
         */
        assert: function(bool) {
            var _this = this;
            if (bool) {
                this.ifFlow.execute(this.execArgs, function(throwable) {
                    _this.complete(throwable, bool);
                });
            } else {
                this.nextElseFlow();
            }
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
