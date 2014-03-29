//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PutChange')

//@Require('Class')
//@Require('ObservableChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ObservableChange    = bugpack.require('ObservableChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ObservableChange}
 */
var PutChange = Class.extend(ObservableChange, /** @lends {PutChange.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {*} value
     * @param {*=} previousValue
     */
    _constructor: function(objectPath, key, value, previousValue) {

        this._super(PutChange.CHANGE_TYPE, objectPath);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.key            = key;

        /**
         * @private
         * @type {*}
         */
        this.previousValue  = previousValue;

        /**
         * @private
         * @type {*}
         */
        this.value          = value;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {*}
     */
    getKey: function() {
        return this.key;
    },

    /**
     * @return {*}
     */
    getPreviousValue: function() {
        return this.previousValue;
    },

    /**
     * @return {*}
     */
    getValue: function() {
        return this.value;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {PutChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var cloneChange = new PutChange(this.getObjectPath(), this.getKey(), this.getValue(), this.getPreviousValue());
        cloneChange.setChangingObservable(this.getChangingObservable());
        cloneChange.setReportingObservable(this.getReportingObservable());
        return cloneChange;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
PutChange.CHANGE_TYPE = "Put";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('PutChange', PutChange);
