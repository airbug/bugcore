//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RemovePropertyChange')

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
var RemovePropertyChange = Class.extend(ObservableChange, /** @lends {RemovePropertyChange.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {string} propertyName
     * @param {*} previousValue
     */
    _constructor: function(objectPath, propertyName, previousValue) {

        this._super(RemovePropertyChange.CHANGE_TYPE, objectPath);


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


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {RemovePropertyChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var cloneRemovePropertyChange = new RemovePropertyChange(this.getObjectPath(), this.getPropertyName(), this.getPreviousValue());
        cloneRemovePropertyChange.setChangingObservable(this.getChangingObservable());
        cloneRemovePropertyChange.setReportingObservable(this.getReportingObservable());
        return cloneRemovePropertyChange;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
RemovePropertyChange.CHANGE_TYPE = "RemoveProperty";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('RemovePropertyChange', RemovePropertyChange);
