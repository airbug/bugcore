//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('BugCore')

//@Require('Class')
//@Require('Collection')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Collection      = bugpack.require('Collection');
var List            = bugpack.require('List');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');
var Set             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var BugCore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Public Properties
        //-------------------------------------------------------------------------------

        /**
         * @type {function(new:Collection)}
         */
        this.Collection     = Collection;

        /**
         * @type {function(new:List)}
         */
        this.List           = List;

        /**
         * @type {function(new:Map)}
         */
        this.Map            = Map;

        /**
         * @type {function(new:Set)}
         */
        this.Set            = Set;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {Collection.<C>}
     */
    collection: function(items) {
        return new Collection(items);
    },

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {List.<C>}
     */
    list: function(items) {
        return new List(items);
    },

    /**
     * @param {Map.<K, V>=} map
     * @return {Map.<K, V>}
     */
    map: function(map) {
        return new Map(map);
    },

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {Set.<C>}
     */
    set: function(items) {
        return new Set(items);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('BugCore', BugCore);
