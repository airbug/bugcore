//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableChange')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var ObservableChange = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} changeType
     * @param {string} objectPath
     */
    _constructor: function(changeType, objectPath) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.changeType             = changeType;

        /**
         * @private
         * @type {IObservable}
         */
        this.changingObservable     = undefined;

        /**
         * @private
         * @type {string}
         */
        this.objectPath             = objectPath;

        /**
         * @private
         * @type {IObservable}
         */
        this.reportingObservable    = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {string}
     */
    getChangeType: function() {
        return this.changeType;
    },

    /**
     * @return {IObservable}
     */
    getChangingObservable: function() {
        return this.changingObservable;
    },

    /**
     * @param {IObservable} changingObservable
     */
    setChangingObservable: function(changingObservable) {
        this.changingObservable = changingObservable;
    },

    /**
     * @return {string}
     */
    getObjectPath: function() {
        return this.objectPath;
    },

    /**
     * @param {string} objectPath
     */
    setObjectPath: function(objectPath) {
        this.objectPath = objectPath;
    },

    /**
     * @return {IObservable}
     */
    getReportingObservable: function() {
        return this.reportingObservable;
    },

    /**
     * @param {IObservable} reportingObservable
     */
    setReportingObservable: function(reportingObservable) {
        this.reportingObservable = reportingObservable;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObservableChange', ObservableChange);
