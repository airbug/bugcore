//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('SetPropertyChange')

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
var SetPropertyChange = Class.extend(ObservableChange, /** @lends {SetPropertyChange.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {string} propertyName
     * @param {*} propertyValue
     * @param {*} previousValue
     */
    _constructor: function(objectPath, propertyName, propertyValue, previousValue) {

        this._super(SetPropertyChange.CHANGE_TYPE, objectPath);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.previousValue  = previousValue;

        /**
         * @private
         * @type {string}
         */
        this.propertyName   = propertyName;

        /**
         * @private
         * @type {*}
         */
        this.propertyValue  = propertyValue;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getPreviousValue: function() {
        return this.previousValue;
    },

    /**
     * @return {string}
     */
    getPropertyName: function() {
        return this.propertyName;
    },

    /**
     * @return {*}
     */
    getPropertyValue: function() {
        return this.propertyValue;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {SetPropertyChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning
    
        var cloneSetPropertyChange = new SetPropertyChange(this.getObjectPath(), this.getPropertyName(), this.getPropertyValue(), this.getPreviousValue());
        cloneSetPropertyChange.setChangingObservable(this.getChangingObservable());
        cloneSetPropertyChange.setReportingObservable(this.getReportingObservable());
        return cloneSetPropertyChange;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
SetPropertyChange.CHANGE_TYPE = "SetProperty";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('SetPropertyChange', SetPropertyChange);
