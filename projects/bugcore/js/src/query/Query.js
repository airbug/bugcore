//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Query')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('ICondition')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug = bugpack.require('ArgumentBug');
var Class       = bugpack.require('Class');
var ICondition  = bugpack.require('ICondition');
var Obj         = bugpack.require('Obj');
var Set         = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Query = Class.extend(Obj, {

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
         * @type {Set.<ICondition>}
         */
        this.conditionSet   = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Set.<ICondition>}
     */
    getConditionSet: function() {
        return this.conditionSet;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {ICondition} condition
     */
    addCondition: function(condition) {
        if (!Class.doesImplement(condition, ICondition)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "condition", condition, "parameter must implement ICondition");
        }
        if (!this.conditionSet.contains(condition)) {
            this.conditionSet.add(condition);
        }
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    run: function(value) {
        var conditionArray = this.conditionSet.toArray();
        for (var i = 0, size = conditionArray.length; i < size; i++) {
            var condition = conditionArray[i];
            var result = condition.check(value);
            if (!result) {
                return false;
            }
        }
        return true;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Query', Query);
