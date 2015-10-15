/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collections')

//@Require('BidiMap')
//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('List')
//@Require('Map')
//@Require('MultiListMap')
//@Require('Obj')
//@Require('Queue')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var BidiMap         = bugpack.require('BidiMap');
    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
    var Exception       = bugpack.require('Exception');
    var List            = bugpack.require('List');
    var Map             = bugpack.require('Map');
    var MultiListMap    = bugpack.require('MultiListMap');
    var Obj             = bugpack.require('Obj');
    var Queue           = bugpack.require('Queue');
    var Set             = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Collections = Class.extend(Obj, {
        _name: "Collections"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------


    /**
     * @static
     * @param {(IKeyValueIterable.<K, V> | Object.<K, V>)} map
     * @return {BidiMap.<K, V>}
     * @template K, V
     */
    Collections.bidiMap = function() {
        return new BidiMap();
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Collection.<I>}
     * @template I
     */
    Collections.collection = function(items) {
        return new Collection(items);
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Collection.<I>}
     * @template I
     */
    Collections.ensureCollection = function(items) {
        if (!Class.doesExtend(items, Collection)) {
            return new Collection(items);
        } else {
            return /** @type {Collection.<I>} */(items);
        }
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {List.<I>}
     * @template I
     */
    Collections.ensureList = function(items) {
        if (!Class.doesExtend(items, List)) {
            return new List(items);
        } else {
            return /** @type {List.<I>} */(items);
        }
    };

    /**
     * @static
     * @param {?(IKeyValueIterable.<K, V> | Object.<K, V>)=} map
     * @return {Map.<K, V>}
     * @template K, V
     */
    Collections.ensureMap = function(map) {
        if (!Class.doesExtend(map, Map)) {
            return new Map(map);
        } else {
            return /** @type {Map.<K, V>} */(map);
        }
    };

    /**
     * @static
     * @param {?(IMap.<K, V> | Object.<K, V>)=} map
     * @return {MultiListMap.<K, V>}
     */
    Collections.ensureMultiListMap = function(map) {
        if (!Class.doesExtend(map, MultiListMap)) {
            return new MultiListMap(map);
        } else {
            return /** @type {MultiListMap.<I>} */(map);
        }
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Queue.<I>}
     * @template I
     */
    Collections.ensureQueue = function(items) {
        if (!Class.doesExtend(items, Queue)) {
            return new Queue(items);
        } else {
            return /** @type {Queue.<I>} */(items);
        }
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Set.<I>}
     * @template I
     */
    Collections.ensureSet = function(items) {
        if (!Class.doesExtend(items, Set)) {
            return new Set(items);
        } else {
            return /** @type {Set.<I>} */(items);
        }
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {List.<I>}
     * @template I
     */
    Collections.list = function(items) {
        return new List(items);
    };

    /**
     * @static
     * @param {(IKeyValueIterable.<K, V> | Object.<K, V>)=} map
     * @return {Map.<K, V>}
     * @template K, V
     */
    Collections.map = function(map) {
        return new Map(map);
    };

    /**
     * @static
     * @param {?(IMap.<K, V> | Object.<K, V>)=} map
     * @return {MultiListMap.<K, V>}
     */
    Collections.multiListMap = function(map) {
        return new MultiListMap(map);
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Queue}
     * @template I
     */
    Collections.queue = function(items) {
        return new Queue(items);
    };

    /**
     * @static
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Set.<I>}
     * @template I
     */
    Collections.set = function(items) {
        return new Set(items);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Collections', Collections);
});
