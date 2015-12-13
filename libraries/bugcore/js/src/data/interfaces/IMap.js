/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IMap')

//@Require('IObjectable')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IObjectable     = bugpack.require('IObjectable');
    var Interface       = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /*eslint-disable no-unused-vars */
    /**
     * @interface
     * @extends {IObjectable.<K, V>}
     * @template K, V
     */
    var IMap = Interface.extend(IObjectable, {

        _name: 'IMap',


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
        remove: function(key) {},

        /**
         * @return {Array.<K>}
         */
        toKeyArray: function() {},

        /**
         * @return {ICollection.<K>}
         */
        toKeyCollection: function() {},

        /**
         * @return {Array.<V>}
         */
        toValueArray: function() {},

        /**
         * @return {ICollection.<V>}
         */
        toValueCollection: function() {}
    });
    /*eslint-enable no-unused-vars */


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IMap', IMap);
});
