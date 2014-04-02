//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('BugCore')

//@Require('Class')
//@Require('Collection')
//@Require('Func')
//@Require('IClone')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('Interface')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Pair')
//@Require('Queue')
//@Require('Set')
//@Require('Stack')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Collection      = bugpack.require('Collection');
var Func            = bugpack.require('Func');
var IClone          = bugpack.require('IClone');
var IEquals         = bugpack.require('IEquals');
var IHashCode       = bugpack.require('IHashCode');
var Interface       = bugpack.require('Interface');
var List            = bugpack.require('List');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');
var Pair            = bugpack.require('Pair');
var Queue           = bugpack.require('Queue');
var Set             = bugpack.require('Set');
var Stack           = bugpack.require('Stack');
var TypeUtil        = bugpack.require('TypeUtil');


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
         * @type {function(new:Class)}
         */
        this.Class          = Class;

        /**
         * @type {function(new:Collection)}
         */
        this.Collection     = Collection;

        /**
         * @type {function(new:Func)}
         */
        this.Func           = Func;

        /**
         * @type {function(new:IClone)}
         */
        this.IClone         = IClone;

        /**
         * @type {function(new:IEquals)}
         */
        this.IEquals        = IEquals;

        /**
         * @type {function(new:IHashCode)}
         */
        this.IHashCode      = IHashCode;

        /**
         * @type {function(new:Interface)}
         */
        this.Interface      = Interface;

        /**
         * @type {function(new:List)}
         */
        this.List           = List;

        /**
         * @type {function(new:Map)}
         */
        this.Map            = Map;

        /**
         * @type {function(new:Obj)}
         */
        this.Obj            = Obj;

        /**
         * @type {function(new:Pair)}
         */
        this.Pair           = Pair;

        /**
         * @type {function(new:Queue)}
         */
        this.Queue          = Queue;

        /**
         * @type {function(new:Set)}
         */
        this.Set            = Set;

        /**
         * @type {function(new:Stack)}
         */
        this.Stack          = Stack;

        /**
         * @type {function(new:TypeUtil)}
         */
        this.TypeUtil       = TypeUtil;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {Collection.<C>}
     * @template C
     */
    collection: function(items) {
        return new Collection(items);
    },

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {List.<C>}
     * @template C
     */
    list: function(items) {
        return new List(items);
    },

    /**
     * @param {Map.<K, V>=} map
     * @return {Map.<K, V>}
     * @template K, V
     */
    map: function(map) {
        return new Map(map);
    },

    /**
     * @param {(Collection.<*> | Array.<*>)} items
     * @return {Queue.<C>}
     * @template C
     */
    queue: function(items) {
        return new Queue(items);
    },

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {Set.<C>}
     * @template C
     */
    set: function(items) {
        return new Set(items);
    },

    /**
     * @param {(ICollection.<C> | Array.<C>)=} items
     * @return {Stack.<C>}
     * @template C
     */
    stack: function(items) {
        return new Stack(items);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('BugCore', BugCore);
