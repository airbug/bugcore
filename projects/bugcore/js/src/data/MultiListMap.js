/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MultiListMap')

//@Require('Class')
//@Require('List')
//@Require('MultiMap')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var List        = bugpack.require('List');
    var MultiMap    = bugpack.require('MultiMap');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * Map info
     * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
     * 2) Any value can be used as a key including null but not undefined.
     *
     * @class
     * @extends {MultiMap.<K, V>}
     * @template K, V
     */
    var MultiListMap = Class.extend(MultiMap, /** @lends {MultiListMap.prototype} */{

        _name: "MultiListMap",


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {MultiListMap.<K, V>}
         */
        clone: function(deep) {

            //TODO BRN: Implement "deep" cloning

            /** @type {MultiListMap.<K, V>} */
            var cloneMultiListMap = new MultiListMap();
            cloneMultiListMap.putAll(this);
            return cloneMultiListMap;
        },


        //-------------------------------------------------------------------------------
        // Map Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {K} key
         * @param {V} value
         * @return {V}
         */
        put: function(key, value) {
            var valueSet = this.getHashTable().get(key);
            if (!valueSet) {
                valueSet = new List();
                this.getHashTable().put(key, valueSet);
            }
            var result = valueSet.add(value);
            if (result) {
                return value;
            }
            return undefined;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('MultiListMap', MultiListMap);
});
