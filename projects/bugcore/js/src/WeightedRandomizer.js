//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WeightedRandomizer')

//@Require('Class')
//@Require('Collection')
//@Require('HashTable')
//@Require('MathUtil')
//@Require('Obj')
//@Require('WeightedList')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var Collection =    bugpack.require('Collection');
var HashTable =     bugpack.require('HashTable');
var MathUtil =      bugpack.require('MathUtil');
var Obj =           bugpack.require('Obj');
var WeightedList =  bugpack.require('WeightedList');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WeightedRandomizer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
    // Class methods
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
        var randomNumber = MathUtil.randomBetween(1, totalWeight);
        return this.weightedList.getAtWeight(randomNumber);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('WeightedRandomizer', WeightedRandomizer);
