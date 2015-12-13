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
//@Require('NotifyingArrayIterator')
//@Require('NotifyingObjectIterator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Exception               = bugpack.require('Exception');
    var IIterator               = bugpack.require('IIterator');
    var Obj                     = bugpack.require('Obj');
    var NotifyingArrayIterator    = bugpack.require('NotifyingArrayIterator');
    var NotifyingObjectIterator   = bugpack.require('NotifyingObjectIterator');


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

        _name: 'HashStoreIterator',


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
             * @type {NotifyingArrayIterator.<V>}
             */
            this.hashStoreNodeNotifyingArrayIterator  = null;

            /**
             * @private
             * @type {NotifyingObjectIterator.<HashStoreNode.<V>>}
             */
            this.hashStoreNodeNotifyingObjectIterator = new NotifyingObjectIterator(this.hashStore.getHashStoreNodeNotifyingObject());
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
         * @return {NotifyingArrayIterator.<V>}
         */
        getHashStoreNodeNotifyingArrayIterator: function() {
            return this.hashStoreNodeNotifyingArrayIterator;
        },

        /**
         * @return {NotifyingObjectIterator.<HashStoreNode.<V>>}
         */
        getHashStoreNodeNotifyingObjectIterator: function() {
            return this.hashStoreNodeNotifyingObjectIterator;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            if (this.hashStoreNodeNotifyingObjectIterator.hasNext()) {
                return true;
            }
            if (this.hashStoreNodeNotifyingArrayIterator) {
                return this.hashStoreNodeNotifyingArrayIterator.hasNext();
            }
            return false;
        },

        /**
         * @return {V}
         */
        next: function() {
            if (!this.hashStoreNodeNotifyingArrayIterator) {
                var hashStoreNode = this.hashStoreNodeNotifyingObjectIterator.next();
                if (!hashStoreNode) {
                    throw new Exception('EndOfIteration', {}, 'End of iteration reached');
                }
                this.hashStoreNodeNotifyingArrayIterator = new NotifyingArrayIterator(hashStoreNode.getItemNotifyingArray());
                return this.hashStoreNodeNotifyingArrayIterator.next();
            } else {
                if (!this.hashStoreNodeNotifyingArrayIterator.hasNext()) {
                    this.hashStoreNodeNotifyingArrayIterator = null;
                    return this.next();
                } else {
                    return this.hashStoreNodeNotifyingArrayIterator.next();
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
