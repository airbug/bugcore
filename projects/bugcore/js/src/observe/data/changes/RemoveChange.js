//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RemoveChange')

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
var RemoveChange = Class.extend(ObservableChange, /** @lends {RemoveChange.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {*} value
     */
    _constructor: function(objectPath, value) {

        this._super(RemoveChange.CHANGE_TYPE, objectPath);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.value  = value;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
     * @return {RemoveChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var cloneRemoveChange = new RemoveChange(this.getObjectPath(), this.getValue());
        cloneRemoveChange.setChangingObservable(this.getChangingObservable());
        cloneRemoveChange.setReportingObservable(this.getReportingObservable());
        return cloneRemoveChange;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
RemoveChange.CHANGE_TYPE = "Remove";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('RemoveChange', RemoveChange);
