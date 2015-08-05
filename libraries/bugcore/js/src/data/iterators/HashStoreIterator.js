/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStoreIterator')

//@Require('ArrayIterator')
//@Require('Class')
//@Require('Exception')
//@Require('IIterator')
//@Require('Obj')
//@Require('ObjectIterator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArrayIterator   = bugpack.require('ArrayIterator');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var IIterator       = bugpack.require('IIterator');
    var Obj             = bugpack.require('Obj');
    var ObjectIterator  = bugpack.require('ObjectIterator');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIterator.<V>}
     * @template I
     */
    var HashStoreIterator = Class.extend(Obj, {

        _name: "HashStoreIterator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {HashStore.<I>} hashStore
         */
        _constructor: function(hashStore) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {HashStore.<V>}
             */
            this.hashStore                          = hashStore;

            /**
             * @private
             * @type {ArrayIterator.<V>}
             */
            this.hashStoreNodeArrayIterator         = null;

            /**
             * @private
             * @type {ObjectIterator.<HashStoreNode.<V>>}
             */
            this.hashStoreNodeObjectIterator        = new ObjectIterator(this.hashStore.getHashStoreNodeObject());
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {HashStore.<V>}
         */
        getHashStore: function() {
            return this.hashStore;
        },

        /**
         * @return {ArrayIterator.<V>}
         */
        getHashStoreNodeArrayIterator: function() {
            return this.hashStoreNodeArrayIterator
        },

        /**
         * @return {ObjectIterator.<HashStoreNode.<V>>}
         */
        getHashStoreNodeObjectIterator: function() {
            return this.hashStoreNodeObjectIterator;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            if (this.hashStoreNodeObjectIterator.hasNext()) {
                //console.log("this.hashStoreNodeObjectIterator.hasNext():", true);
                return true;
            }
            if (this.hashStoreNodeArrayIterator) {
                //console.log("this.hashStoreNodeArrayIterator.hasNext():", this.hashStoreNodeArrayIterator.hasNext());
                return this.hashStoreNodeArrayIterator.hasNext();
            }
            return false;
        },

        /**
         * @return {V}
         */
        next: function() {
            if (!this.hashStoreNodeArrayIterator) {
                var hashStoreNodeObject = this.hashStoreNodeObjectIterator.next();
                this.hashStoreNodeArrayIterator = new ArrayIterator(hashStoreNodeObject.getItemArray());
                return this.hashStoreNodeArrayIterator.next();
            } else {
                if (!this.hashStoreNodeArrayIterator.hasNext()) {
                    this.hashStoreNodeArrayIterator = null;
                    return this.next();
                } else {
                    return this.hashStoreNodeArrayIterator.next();
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(HashStoreIterator, IIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashStoreIterator', HashStoreIterator);
});
