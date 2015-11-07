/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStore')

//@Require('Class')
//@Require('HashStoreIterator')
//@Require('HashStoreNode')
//@Require('IArrayable')
//@Require('IIterable')
//@Require('Obj')
//@Require('ReflectObject')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var HashStoreIterator   = bugpack.require('HashStoreIterator');
    var HashStoreNode       = bugpack.require('HashStoreNode');
    var IArrayable          = bugpack.require('IArrayable');
    var IIterable           = bugpack.require('IIterable');
    var Obj                 = bugpack.require('Obj');
    var ReflectObject       = bugpack.require('ReflectObject');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIterable.<I>}
     * @template I
     */
    var HashStore = Class.extend(Obj, {

        _name: "HashStore",


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
             * @type {Number}
             */
            this.count = 0;

            /**
             * @private
             * @type {ReflectObject.<string, HashStoreNode.<I>>}
             */
            this.hashStoreNodeReflectObject = new ReflectObject({});
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getCount: function() {
            return this.count;
        },

        /**
         * @return {ReflectObject.<string, HashStoreNode.<I>>}
         */
        getHashStoreNodeReflectObject: function() {
            return this.hashStoreNodeReflectObject;
        },


        //-------------------------------------------------------------------------------
        // IArrayable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<I>}
         */
        toArray: function() {
            var array = [];
            this.hashStoreNodeReflectObject.forIn(function(valueHashCode, hashStoreNode) {
                array = array.concat(hashStoreNode.getItemReflectArray().getArray());
            });
            return array;
        },


        //-------------------------------------------------------------------------------
        // IIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value in the HashStore is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the HashStore over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(I)} func
         */
        forEach: function(func) {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                func(iterator.next());
            }
        },

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @return {IIterator.<I>}
         */
        iterator: function() {
            return new HashStoreIterator(this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         */
        add: function(item) {
            var hashCode = Obj.hashCode(item).toString();
            var hashStoreNode = this.hashStoreNodeReflectObject.getProperty(hashCode);
            if (!hashStoreNode) {
                hashStoreNode = new HashStoreNode();
                this.hashStoreNodeReflectObject.setProperty(hashCode, hashStoreNode);
            }
            hashStoreNode.add(item);
            this.count++;
        },

        /**
         *
         */
        clear: function() {
            var iterator = this.iterator();
            while (iterator.hasNext()) {
                var item = iterator.next();
                this.remove(item);
            }
        },

        /**
         * @param {*} item
         * @return {boolean}
         */
        contains: function(item) {
            var hashCode        = Obj.hashCode(item).toString();
            var hashStoreNode   = this.hashStoreNodeReflectObject.getProperty(hashCode);
            if (hashStoreNode) {
                return hashStoreNode.contains(item);
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {number}
         */
        countValue: function(value) {
            var valueHashCode = Obj.hashCode(value).toString();
            var hashStoreNode = this.hashStoreNodeReflectObject.getProperty(valueHashCode);
            if (hashStoreNode) {
                return hashStoreNode.countValue(value);
            }
            return 0;
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.count === 0;
        },

        /**
         * @param {*} item
         * @return {boolean}
         */
        remove: function(item) {
            var hashCode = Obj.hashCode(item).toString();
            var hashStoreNode = this.hashStoreNodeReflectObject.getProperty(hashCode);
            var result = false;
            if (hashStoreNode) {
                result = hashStoreNode.remove(item);
                if (result) {
                    this.count--;
                    if (hashStoreNode.getCount() === 0) {
                        this.hashStoreNodeReflectObject.deleteProperty(hashCode);
                    }
                }
            }
            return result;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(HashStore, IArrayable);
    Class.implement(HashStore, IIterable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashStore', HashStore);
});
