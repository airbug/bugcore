//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('WhereCondition')

//@Require('Class')
//@Require('ICondition')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ICondition              = bugpack.require('ICondition');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @implements {ICondition}
 * @extends {Obj}
 */
var WhereCondition = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function(propertyQuery, inSet) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<string>}
         */
        this.inSet              = inSet;

        /**
         * @private
         * @type {string}
         */
        this.propertyQuery      = propertyQuery;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Set.<string>}
     */
    getInSet: function() {
        return this.inSet;
    },

    /**
     * @returns {string}
     */
    getPropertyQuery: function() {
        return this.propertyQuery;
    },


    //-------------------------------------------------------------------------------
    // ICondition Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} value
     * @return {boolean}
     */
    check: function(value) {
        var propertyValue = Obj.findProperty(value, this.propertyQuery);
        if (this.inSet.contains(propertyValue)) {
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(WhereCondition, ICondition);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('WhereCondition', WhereCondition);
