/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collections')

//@Require('Class')
//@Require('Collection')
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

    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
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
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {Collection.<I>}
     * @template I
     */
    Collections.collection = function(items) {
        return new Collection(items);
    };

    /**
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @return {List.<I>}
     * @template I
     */
    Collections.list = function(items) {
        return new List(items);
    };

    /**
     * @param {?(IMap.<K, V> | Object.<K, V>)=} map
     * @return {Map.<K, V>}
     * @template K, V
     */
    Collections.map = function(map) {
        return new Map(map);
    };

    /**
     * @param {?(IMap.<K, V> | Object.<K, V>)=} map
     * @returns {MultiListMap.<K, V>}
     */
    Collections.multiListMap = function(map) {
        return new MultiListMap(map);
    };

    /**
     * @param {?(ICollection.<I> | Array.<I>)=} items
     * @returns {Queue}
     * @template I
     */
    Collections.queue = function(items) {
        return new Queue(items);
    };

    /**
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
