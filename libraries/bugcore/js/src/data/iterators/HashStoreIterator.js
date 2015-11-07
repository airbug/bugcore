/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStoreIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IIterator')
//@Require('Obj')
//@Require('ReflectArrayIterator')
//@Require('ReflectObjectIterator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var IIterator               = bugpack.require('IIterator');
    var Obj                     = bugpack.require('Obj');
    var ReflectArrayIterator    = bugpack.require('ReflectArrayIterator');
    var ReflectObjectIterator   = bugpack.require('ReflectObjectIterator');


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
             * @type {ReflectArrayIterator.<V>}
             */
            this.hashStoreNodeReflectArrayIterator  = null;

            /**
             * @private
             * @type {ReflectObjectIterator.<HashStoreNode.<V>>}
             */
            this.hashStoreNodeReflectObjectIterator = new ReflectObjectIterator(this.hashStore.getHashStoreNodeReflectObject());
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
         * @return {ReflectArrayIterator.<V>}
         */
        getHashStoreNodeReflectArrayIterator: function() {
            return this.hashStoreNodeReflectArrayIterator
        },

        /**
         * @return {ReflectObjectIterator.<HashStoreNode.<V>>}
         */
        getHashStoreNodeReflectObjectIterator: function() {
            return this.hashStoreNodeReflectObjectIterator;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            if (this.hashStoreNodeReflectObjectIterator.hasNext()) {
                return true;
            }
            if (this.hashStoreNodeReflectArrayIterator) {
                return this.hashStoreNodeReflectArrayIterator.hasNext();
            }
            return false;
        },

        /**
         * @return {V}
         */
        next: function() {
            if (!this.hashStoreNodeReflectArrayIterator) {
                var hashStoreNode = this.hashStoreNodeReflectObjectIterator.next();
                if (!hashStoreNode) {
                    throw new Exception("EndOfIteration", {}, "End of iteration reached");
                }
                this.hashStoreNodeReflectArrayIterator = new ReflectArrayIterator(hashStoreNode.getItemReflectArray());
                return this.hashStoreNodeReflectArrayIterator.next();
            } else {
                if (!this.hashStoreNodeReflectArrayIterator.hasNext()) {
                    this.hashStoreNodeReflectArrayIterator = null;
                    return this.next();
                } else {
                    return this.hashStoreNodeReflectArrayIterator.next();
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
