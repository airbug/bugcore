//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ICollection')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface           = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @template I
     */
    var ICollection = Interface.declare({

        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {I} item
         * @return {boolean}
         */
        add: function(item) {},

        /**
         * @param {(ICollection.<I> | Array.<I>)} items
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
         * @param {(ICollection.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsAll: function(values) {},

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         * @return {boolean}
         */
        containsEqual: function(values) {},

        /**
         * NOTE BRN: If a value is modified in one iteration and then visited at a later time, its value in the loop is
         * its value at that later time. A value that is deleted before it has been visited will not be visited later.
         * Values added to the Collection over which iteration is occurring may either be visited or omitted from iteration.
         * In general it is best not to add, modify or remove values from the Collection during iteration, other than the
         * value currently being visited. There is no guarantee whether or not an added value will be visited, whether
         * a modified value (other than the current one) will be visited before or after it is modified, or whether a
         * deleted value will be visited before it is deleted.
         *
         * @param {function(I)} func
         */
        forEach: function(func) {},

        /**
         * @return {number}
         */
        getCount: function() {},

        /**
         * @return {Array.<I>}
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
         * @param {function(I):*} fn
         * @param {*} context
         * @return {ICollection.<*>}
         */
        map: function(fn, context) {},

        /**
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {},

        /**
         * @param {(ICollection.<*> | Array.<*>)} values
         */
        removeAll: function(values) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ICollection', ICollection);
});
