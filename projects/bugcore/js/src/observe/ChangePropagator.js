//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ChangePropagator')

//@Require('Class')
//@Require('IChangePropagator')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IChangePropagator   = bugpack.require('IChangePropagator');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 * @implements {IChangePropagator}
 */
var ChangePropagator = Class.extend(Obj, {

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
         * @type {List.<IChangePropagator>}
         */
        this.changePropagatorList   = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {List.<IChangePropagator>}
     */
    getChangePropagatorList: function() {
        return this.changePropagatorList;
    },


    //-------------------------------------------------------------------------------
    // IChangePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IChangePropagator} changePropagator
     */
    addChangePropagator: function(changePropagator) {
        if (!this.changePropagatorList.contains(changePropagator)) {
            this.changePropagatorList.add(changePropagator);
        }
    },

    /**
     * @param {ObservableChange} change
     */
    propagateChange: function(change) {
        change.setReportingObservable(this);
        this.changePropagatorList.forEach(function(changePropagator) {
            changePropagator.propagateChange(change);
        });
    },

    /**
     * @param {IChangePropagator} changePropagator
     */
    removeChangePropagator: function(changePropagator) {
        if (this.changePropagatorList.contains(changePropagator)) {
            this.changePropagatorList.remove(changePropagator);
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(ChangePropagator, IChangePropagator);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ChangePropagator', ChangePropagator);
