//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IList')

//@Require('ICollection')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ICollection         = bugpack.require('ICollection');
var Interface           = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

/**
 * @interface
 * @extends {ICollection.<B>}
 * @template B
 */
var IList = Interface.extend(ICollection, {

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {number} index
     * @param {B} value
     */
    addAt: function(index, value) {},

    /**
     * @param {number} index
     * @param {(ICollection.<B> | Array.<B>)} items
     */
    addAllAt: function(index, items) {},

    /**
     * @param {number} index
     * @return {B}
     */
    getAt: function(index) {},

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfFirst: function(value) {},

    /**
     * @param {*} value
     * @return {number}
     */
    indexOfLast: function(value) {},

    /**
     * @param {number} index
     * @return {B} The removed value
     */
    removeAt: function(index) {},

    /**
     * @param {number} index
     * @param {B} value
     */
    set: function(index, value) {},

    /**
     * @param {number} fromIndex
     * @param {number} toIndex
     * @return {IList.<B>}
     */
    subList: function(fromIndex, toIndex) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('IList', IList);
