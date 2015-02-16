/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collections')

//@Require('Array')
//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('IStreamable')
//@Require('List')
//@Require('Map')
//@Require('MultiListMap')
//@Require('Obj')
//@Require('Queue')
//@Require('Set')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Array           = bugpack.require('Array');
    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
    var Exception       = bugpack.require('Exception');
    var IStreamable     = bugpack.require('IStreamable');
    var List            = bugpack.require('List');
    var Map             = bugpack.require('Map');
    var MultiListMap    = bugpack.require('MultiListMap');
    var Obj             = bugpack.require('Obj');
    var Queue           = bugpack.require('Queue');
    var Set             = bugpack.require('Set');
    var TypeUtil        = bugpack.require('TypeUtil');


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
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Array.<I>}
     * @template I
     */
    Collections.array = function(items) {
        return new Array(items);
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
     * @param {?(IMap.<K, V> | Object.<K, V>)=} map
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
     * @param value
     * @return {*}
     */
    Collections.ensureStreamable = function(value) {
        if (Class.doesImplement(value, IStreamable)) {
            return value;
        } else if (TypeUtil.isArray(value)) {
            return Collections.array(value);
        } else {
            throw new Exception("IllegalArgument", {}, "'value' cannot be made streamable - value:" + value);
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
     * @param {?(IMap.<K, V> | Object.<K, V>)=} map
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
