/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Striped')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var List        = bugpack.require('List');
    var Map         = bugpack.require('Map');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Striped = Class.extend(Obj, {

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
             * @type {Map.<string, *>}
             */
            this.keyToIndexMap  = new Map();

            /**
             * @private
             * @type {List.<*>}
             */
            this.stripeList     = new List();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} stripe
         */
        add: function(stripe) {
            this.stripeList.add(stripe);
        },

        /**
         * @param {string} key
         * @param {number} index
         */
        addKeyToIndex: function(key, index) {
            this.keyToIndexMap.put(key, index);
        },

        /**
         * @param {string} key
         * @param {*} value
         */
        addKeyToStripe: function(key, value) {
            var index = this.stripeList.indexOfFirst(value);
            if (index > -1) {
                this.keyToIndexMap.put(key, index);
            }
        },

        /**
         * @return {*}
         */
        getAt: function(index) {
            return this.stripeList.get(index);
        },

        /**
         * @return {number}
         */
        getStripeCount: function() {
            return this.stripeList.getCount();
        },

        /**
         * @param {*} key
         * @return {*}
         */
        getForKey: function(key) {
            var index = this.keyToIndexMap.get(key);
            if (TypeUtil.isNumber(index)) {
                return this.stripeList.getAt(index);
            }
            return undefined;
        },

        /**
         * @param {number} index
         * @return {boolean}
         */
        containsKeyForIndex: function(index) {
            return this.keyToIndexMap.containsValue(index);
        },

        /**
         * @param {*} key
         */
        removeKey: function(key) {
            this.keyToIndexMap.remove(key);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Striped', Striped);
});
