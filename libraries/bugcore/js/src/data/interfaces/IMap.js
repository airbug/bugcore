/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IMap')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface   = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @template K, V
     */
    var IMap = Interface.declare({

        _name: "IMap",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clear: function() {},

        /**
         * @param {*} key
         * @return {boolean}
         */
        containsKey: function(key) {},

        /**
         * @param {*} value
         * @return {boolean}
         */
        containsValue: function(value) {},

        /**
         * @param {*} key
         * @return {V}
         */
        get: function(key) {},

        /**
         * @return {number}
         */
        getCount: function() {},

        /**
         * @return {Array.<K>}
         */
        getKeyArray: function() {},

        /**
         * @return {ICollection.<K>}
         */
        getKeyCollection: function() {},

        /**
         * @return {Array.<V>}
         */
        getValueArray: function() {},

        /**
         * @return {ICollection.<V>}
         */
        getValueCollection: function() {},

        /**
         * @return {boolean}
         */
        isEmpty: function() {},

        /**
         * @param {K} key
         * @param {V} value
         * @return {V}
         */
        put: function(key, value) {},

        /**
         * @param {(IMap.<K, V> | Object.<K, V>)} map
         */
        putAll: function(map) {},

        /**
         * @param {*} key
         * @return {V}
         */
        remove: function(key) {
            return this.hashTable.remove(key);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IMap', IMap);
});
