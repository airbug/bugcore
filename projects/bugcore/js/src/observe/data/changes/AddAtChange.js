//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('AddAtChange')

//@Require('AddChange')
//@Require('Class')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange           = bugpack.require('AddChange');
var Class               = bugpack.require('Class');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AddChange}
 */
    //NOTE SUNG AddChange and PrependChange should probably extend AddAtChange not the other way around.
var AddAtChange = Class.extend(AddChange, /** @lends {AddAtChange.prototype} */ {

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
     * @return {AddAtChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var cloneAddAtChange = new AddAtChange(this.getObjectPath(), this.getValue(), this.getIndex());
        cloneAddAtChange.setChangingObservable(this.getChangingObservable());
        cloneAddAtChange.setReportingObservable(this.getReportingObservable());
        return cloneAddAtChange;
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('AddAtChange', AddAtChange);
