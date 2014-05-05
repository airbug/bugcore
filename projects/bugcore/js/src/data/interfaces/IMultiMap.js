/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IMultiMap')

//@Require('IMap')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IMap                = bugpack.require('IMap');
    var Interface           = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @extends {IMap.<K,V>}
     * @template K, V
     */
    var IMultiMap = Interface.extend(IMap, /** @lends {IMultiMap.prototype} */{

        _name: "IMultiMap",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getKeyCount: function() {},

        /**
         * @param {function(ICollection.<V>, K)} func
         */
        forEachCollection: function(func) {},

        /**
         * @param {function(V, K)} func
         */
        forEachValue: function(func) {},

        /**
         * @override
         * @param {*} key
         * @return {ICollection.<V>}
         */
        get: function(key) {},

        /**
         * @override
         * @param {*} key
         * @return {ICollection.<V>}
         */
        remove: function(key) {},

        /**
         * @param {*} key
         * @param {*} value
         * @return {boolean}
         */
        removeKeyValuePair: function(key, value) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IMultiMap', IMultiMap);
});
