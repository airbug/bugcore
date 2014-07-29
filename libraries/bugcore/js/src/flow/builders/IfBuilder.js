/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IfBuilder')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('FlowBuilder')
//@Require('If')
//@Require('List')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil         = bugpack.require('ArgUtil');
    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var FlowBuilder     = bugpack.require('FlowBuilder');
    var If              = bugpack.require('If');
    var List            = bugpack.require('List');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {FlowBuilder}
     */
    var IfBuilder = Class.extend(FlowBuilder, {

        _name: "IfBuilder",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(new:Constructor)} flowConstructor
         * @param {Array.<*>} flowConstructorArgs
         */
        _constructor: function(flowConstructor, flowConstructorArgs) {

            this._super(flowConstructor, flowConstructorArgs);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Flow}
             */
            this.elseFlow       = null;

            /**
             * @private
             * @type {List.<IfBuilder>}
             */
            this.elseIfList     = new List();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Flow}
         */
        getElseFlow: function() {
            return this.elseFlow;
        },

        /**
         * @return {List.<IfBuilder>}
         */
        getElseIfList: function() {
            return this.elseIfList;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Flow} elseFlow
         * @return {IfBuilder}
         */
        $else: function(elseFlow) {
            if (this.elseFlow) {
                throw new Bug("IllegalState", {}, "IfFlow already has an ElseFlow");
            }
            this.elseFlow = elseFlow;
            return this;
        },

        /**
         * @param {function()} ifMethod
         * @param {Flow} elseIfFlow
         * @return {IfBuilder}
         */
        $elseIf: function(ifMethod, elseIfFlow) {
            if (this.elseFlow) {
                throw new Bug("IllegalState", {}, "IfFlow already has an ElseFlow");
            }
            var ifFlow = new IfBuilder(If, [ifMethod, elseIfFlow]);
            this.elseIfList.add(ifFlow);
            return this;
        },

        /**
         * @param {(Array.<*> | function(Throwable=))} flowArgs
         * @param {function(Throwable=)=} callback
         */
        execute: function(flowArgs, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "flowArgs", optional: true, type: "array", default: []},
                {name: "callback", optional: false, type: "function"}
            ]);
            flowArgs    = args.flowArgs;
            callback    = args.callback;
            var flow    = this.getFlowConstructor().getClass().newInstance(this.getFlowConstructorArgs());
            flow.addAllElseIf(this.elseIfList);
            flow.setElse(this.elseFlow);
            flow.execute(flowArgs, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('IfBuilder', IfBuilder);
});
