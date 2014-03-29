//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PrependChange')

//@Require('AddAtChange')
//@Require('Class')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddAtChange         = bugpack.require('AddAtChange');
var Class               = bugpack.require('Class');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AddChange}
 */
var PrependChange = Class.extend(AddAtChange, /** @lends {PrependChange.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {*} value
     */
    _constructor: function(objectPath, value) {

        this._super(objectPath, value, 0);
    },

    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {PrependChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var clonePrependChange = new PrependChange(this.getObjectPath(), this.getValue(), this.getIndex());
        clonePrependChange.setChangingObservable(this.getChangingObservable());
        clonePrependChange.setReportingObservable(this.getReportingObservable());
        return clonePrependChange;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('PrependChange', PrependChange);
