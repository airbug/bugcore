/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CollectionIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IIterator')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Exception   = bugpack.require('Exception');
    var IIterator   = bugpack.require('IIterator');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIterator.<I>}
     * @template I
     */
    var CollectionIterator = Class.extend(Obj, {

        _name: "CollectionIterator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Collection.<I>} collection
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
             * @type {Array.<I>}
             */
            this.collectionValueArray = collection.getValueArray();

            /**
             * @private
             * @type {number}
             */
            this.index = -1;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            return (this.index < (this.collectionSize - 1));
        },

        /**
         * @return {I}
         */
        next: function() {
            if (this.hasNext()) {
                this.index++;
                return this.collectionValueArray[this.index];
            } else {
                throw new Exception("NoSuchElement", {}, "End of iteration reached.");
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
});
