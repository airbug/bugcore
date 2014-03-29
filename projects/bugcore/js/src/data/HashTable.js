//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashTable')

//@Require('Class')
//@Require('HashTableNode')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var HashTableNode = bugpack.require('HashTableNode');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashTable = Class.extend(Obj, {

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
         * @type {number}
         */
        this.count = 0;

        /**
         * @private
         * @type {Object}
         */
        this.hashTableNodeObject = {};
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


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @return {boolean}
     */
    containsKey: function(key) {
        var keyHashCode = Obj.hashCode(key);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        if (hashTableNode) {
            return hashTableNode.containsKey(key);
        }
        return false;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    containsValue: function(value) {

        // NOTE BRN: We don't need to use Obj.forIn here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            if (hashTableNode.containsValue(value)) {
                return true;
            }
        }
        return false;
    },

    /**
     * NOTE BRN:
     * @param {function(*)} func
     */
    forEach: function(func) {

        // NOTE BRN: We don't need to use Obj.forIn here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            var keyArray = hashTableNode.getKeyArray();
            hashTableNode.getValueArray().forEach(function(value, index) {
                var key = keyArray[index];
                func(value, key);
            });
        }
    },

    /**
     * @param {*} key
     * @return {*}
     */
    get: function(key) {
        var keyHashCode = Obj.hashCode(key);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        if (hashTableNode) {
            return hashTableNode.get(key);
        }
        return undefined;
    },

    /**
     * @return {Array<*>}
     */
    getKeyArray: function() {
        var keysArray = [];

        // NOTE BRN: We don't need to use Obj.forIn here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            keysArray = keysArray.concat(hashTableNode.getKeyArray());
        }
        return keysArray;
    },

    /**
     * @return {Array<*>}
     */
    getValueArray: function() {
        var valuesArray = [];

        // NOTE BRN: We don't need to use Obj.forIn here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        for (var keyHashCode in this.hashTableNodeObject) {
            var hashTableNode = this.hashTableNodeObject[keyHashCode];
            valuesArray = valuesArray.concat(hashTableNode.getValueArray());
        }
        return valuesArray;
    },

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return (this.count === 0);
    },

    /**
     * @param {*} key
     * @param {*} value
     * @return {*} Returns undefined if no value already existed at this key
     */
    put: function(key, value) {
        var keyHashCode = Obj.hashCode(key);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        if (!hashTableNode) {
            hashTableNode = new HashTableNode();
            this.hashTableNodeObject[keyHashCode] = hashTableNode;
        }
        var returnValue = hashTableNode.put(key, value);
        if (returnValue === undefined) {
            this.count++;
        }
        return returnValue;
    },

    /**
     * @param {*} key
     * @return {*} Returns undefined if no value already existed at this key
     */
    remove: function(key) {
        var keyHashCode = Obj.hashCode(key);

        // NOTE BRN: We don't need to use Obj.getProperty here because we only use numbers (hashcodes) as properties on the
        // hashTableNodeObject object. Those will never conflict with our native properties. We also do not extend the prototype of
        // the hashTableNodeObject object. So we shouldn't run in to conflicts with prototype values.

        var hashTableNode = this.hashTableNodeObject[keyHashCode];
        var returnValue = undefined;
        if (hashTableNode) {
            returnValue = hashTableNode.remove(key);
            if (returnValue !== undefined) {
                this.count--;
                if (hashTableNode.getCount() === 0) {
                    delete this.hashTableNodeObject[keyHashCode];
                }
            }
        }
        return returnValue;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HashTable', HashTable);
