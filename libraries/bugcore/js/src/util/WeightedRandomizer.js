/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedRandomizer')

//@Require('Class')
//@Require('Collection')
//@Require('HashTable')
//@Require('Obj')
//@Require('RandomUtil')
//@Require('WeightedList')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
    var HashTable       = bugpack.require('HashTable');
    var Obj             = bugpack.require('Obj');
    var RandomUtil      = bugpack.require('RandomUtil');
    var WeightedList    = bugpack.require('WeightedList');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var WeightedRandomizer = Class.extend(Obj, {

        _name: "WeightedRandomizer",


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
             * @type {WeightedList}
             */
            this.weightedList = new WeightedList();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getCount: function() {
            return this.weightedList.getCount();
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @param {number} weight
         */
        addValue: function(value, weight) {
            this.weightedList.add(value, weight);
        },

        /**
         * @return {*}
         */
        getRandom: function() {
            var totalWeight = this.weightedList.getTotalWeight();
            var randomNumber = RandomUtil.randomBetween(1, totalWeight);
            return this.weightedList.getAtWeight(randomNumber);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('WeightedRandomizer', WeightedRandomizer);
});
