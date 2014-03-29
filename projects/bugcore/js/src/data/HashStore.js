//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStore')

//@Require('Class')
//@Require('HashStoreNode')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =         bugpack.require('Class');
var HashStoreNode = bugpack.require('HashStoreNode');
var Obj =           bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

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
         * @type {Object}
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
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {
        var valueHashCode = Obj.hashCode(value);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashStoreNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashStoreNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        if (hashStoreNode) {
            return hashStoreNode.getValueCount(value);
        }
        return 0;
    },


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    addValue: function(value) {
        var valueHashCode = Obj.hashCode(value);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashStoreNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashStoreNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        if (!hashStoreNode) {
            hashStoreNode = new HashStoreNode();
            this.hashStoreNodeObject[valueHashCode] = hashStoreNode;
        }
        hashStoreNode.addValue(value);
        this.count++;
    },

    /**
     * NOTE BRN: If a value in the HashStore is modified in one iteration and then visited at a later time, its value in the loop is
     * its value at that later time. A value that is deleted before it has been visited will not be visited later.
     * Values added to the HashStore over which iteration is occurring may either be visited or omitted from iteration.
     * In general it is best not to add, modify or remove values from the object during iteration, other than the
     * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
     * a modified value (other than the current one) will be visited before or after it is modified, or whether a
     * deleted value will be visited before it is deleted.
     *
     * @param {function(*)} func
     */
    forEach: function(func) {

        // NOTE BRN: We don't need to use Obj.forIn here because we only use numbers (hashcodes) as properties on the
        // hashStoreNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashStoreNodeObject object. So we shouldn't run in to conflicts with prototype values.

        for (var valueHashCode in this.hashStoreNodeObject) {
            var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
            hashStoreNode.getValueArray().forEach(function(value) {
                func(value);
            });
        }
    },

    /**
     * @return {Array}
     */
    getValueArray: function() {
        var valueArray = [];

        // NOTE BRN: We don't need to use Obj.forIn here because we only use numbers (hashcodes) as properties on the
        // hashStoreNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashStoreNodeObject object. So we shouldn't run in to conflicts with prototype values.

        for (var valueHashCode in this.hashStoreNodeObject) {
            var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
            valueArray = valueArray.concat(hashStoreNode.getValueArray());
        }
        return valueArray;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    hasValue: function(value) {
        var valueHashCode = Obj.hashCode(value);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashStoreNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashStoreNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
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

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashStoreNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashStoreNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashStoreNode = this.hashStoreNodeObject[valueHashCode];
        var result = false;
        if (hashStoreNode) {
            result = hashStoreNode.removeValue(value);
            if (result) {
                if (hashStoreNode.getCount() === 0) {
                    delete this.hashStoreNodeObject[valueHashCode];
                }
                this.count--;
            }
        }
        return result;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HashStore', HashStore);
