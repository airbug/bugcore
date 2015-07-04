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
//@Require('IIterable')
//@Require('Obj')
//@Require('ObjectUtil')


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
    var IIterable           = bugpack.require('IIterable');
    var Obj                 = bugpack.require('Obj');
    var ObjectUtil          = bugpack.require('ObjectUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IIterable.<V>}
     * @template V
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
             * @type {Object.<string, HashStoreNode.<V>>}
             */
            this.hashStoreNodeObject = {};
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
         * @return {Object.<string, HashStoreNode.<V>>}
         */
        getHashStoreNodeObject: function() {
            return this.hashStoreNodeObject;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {number}
         */
        getValueCount: function(value) {
            var valueHashCode = Obj.hashCode(value);
            var hashStoreNode = ObjectUtil.getOwnProperty(this.hashStoreNodeObject, valueHashCode.toString());
            if (hashStoreNode) {
                return hashStoreNode.getValueCount(value);
            }
            return 0;
        },


        //-------------------------------------------------------------------------------
        // IIterable Implementation
        //-------------------------------------------------------------------------------

        /**
         * NOTE BRN: If a value in the HashStore is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the HashStore over which iteration is occurring may either be visited or omitted from iteration.
         *
         * @param {function(V)} func
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
         * @return {IIterator.<V>}
         */
        iterator: function() {
            return new HashStoreIterator(this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {V} value
         */
        addValue: function(value) {
            var valueHashCode = Obj.hashCode(value);
            var hashStoreNode = ObjectUtil.getOwnProperty(this.hashStoreNodeObject, valueHashCode.toString());
            if (!hashStoreNode) {
                hashStoreNode = new HashStoreNode();
                this.hashStoreNodeObject[valueHashCode] = hashStoreNode;
            }
            hashStoreNode.addValue(value);
            this.count++;
        },

        /**
         * @return {Array.<V>}
         */
        getValueArray: function() {
            var valueArray = [];
            ObjectUtil.forInOwn(this.hashStoreNodeObject, function(valueHashCode, hashStoreNode) {
                valueArray = valueArray.concat(hashStoreNode.getValueArray());
            });
            return valueArray;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        hasValue: function(value) {
            var valueHashCode = Obj.hashCode(value);
            var hashStoreNode = ObjectUtil.getOwnProperty(this.hashStoreNodeObject, valueHashCode.toString());
            if (hashStoreNode) {
                return hashStoreNode.containsValue(value);
            }
            return false;
        },

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.count === 0;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        removeValue: function(value) {
            var valueHashCode = Obj.hashCode(value);
            var hashStoreNode = ObjectUtil.getOwnProperty(this.hashStoreNodeObject, valueHashCode.toString());
            var result = false;
            if (hashStoreNode) {
                result = hashStoreNode.removeValue(value);
                if (result) {
                    this.count--;
                    if (hashStoreNode.getCount() === 0) {
                        ObjectUtil.deleteProperty(this.hashStoreNodeObject, valueHashCode.toString());
                    }
                }
            }
            return result;
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(HashStore, IIterable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashStore', HashStore);
});
