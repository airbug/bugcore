//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CollectionIterator')

//@Require('Class')
//@Require('IIterator')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var IIterator   = bugpack.require('IIterator');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 * @implements {IIterator}
 */
var CollectionIterator = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Collection} collection
     */
    _constructor: function(collection) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {number}
         */
        this.collectionSize = collection.getCount();

        /**
         * @private
         * @type {Array.<*>}
         */
        this.collectionValueArray = collection.getValueArray();

        /**
         * @private
         * @type {number}
         */
        this.index = -1;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasNext: function() {
        return (this.index < (this.collectionSize - 1));
    },

    /**
     * @return {*}
     */
    next: function() {
        if (this.hasNext()) {
            this.index++;
            return this.collectionValueArray[this.index];
        } else {
            throw new Error("No such element. End of iteration reached.");
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(CollectionIterator, IIterator);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('CollectionIterator', CollectionIterator);
