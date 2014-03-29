//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ICollection')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 * @template A
 */
var ICollection = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {A} value
     * @return {boolean}
     */
    add: function(value) {},

    /**
     * @param {(ICollection.<A> | Array.<A>)} items
     */
    addAll: function(items) {},

    /**
     *
     */
    clear: function() {},

    /**
     * @param {*} value
     * @return {boolean}
     */
    contains: function(value) {},

    /**
     * Multiple elements are ignored in this function.
     * e.g. Collection[0,1] containsAll Collection[0,1,1,1] is true
     * If you want to check for exact equality, use the equals function.
     * Empty collections are always contained by another collection
     * e.g. Collection[0,1] containsAll Collection[] is true
     * @param {(ICollection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsAll: function(items) {},

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     * @return {boolean}
     */
    containsEqual: function(items) {},

    /**
     * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
     * its value at that later time. A value that is deleted before it has been visited will not be visited later.
     * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
     * In general it is best not to add, modify or remove values from the Collection during iteration, other than the
     * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
     * a modified value (other than the current one) will be visited before or after it is modified, or whether a
     * deleted value will be visited before it is deleted.
     *
     * @param {function(A)} func
     */
    forEach: function(func) {},

    /**
     * @return {number}
     */
    getCount: function() {},

    /**
     * @return {Array.<A>}
     */
    getValueArray: function() {},

    /**
     * @param {*} value
     * @return {number}
     */
    getValueCount: function(value) {},

    /**
     * @return {boolean}
     */
    isEmpty: function() {},

    /**
     * @param {*} value
     * @return {boolean}
     */
    remove: function(value) {},

    /**
     * @param {(ICollection.<*> | Array.<*>)} items
     */
    removeAll: function(items) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ICollection', ICollection);
