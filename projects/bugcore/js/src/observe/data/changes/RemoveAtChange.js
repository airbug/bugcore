//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RemoveAtChange')

//@Require('RemoveChange')
//@Require('Class')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var RemoveChange        = bugpack.require('RemoveChange');
var Class               = bugpack.require('Class');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {RemoveChange}
 */
var RemoveAtChange = Class.extend(RemoveChange, /** @lends {RemoveAtChange.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {*} value
     * @param {number} index
     */
    _constructor: function(objectPath, value, index) {

        this._super(objectPath, value);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this.index  = index;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getIndex: function() {
        return this.index;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {RemoveAtChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var cloneRemoveAtChange = new RemoveAtChange(this.getObjectPath(), this.getValue(), this.getIndex());
        cloneRemoveAtChange.setChangingObservable(this.getChangingObservable());
        cloneRemoveAtChange.setReportingObservable(this.getReportingObservable());
        return cloneRemoveAtChange;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('RemoveAtChange', RemoveAtChange);
