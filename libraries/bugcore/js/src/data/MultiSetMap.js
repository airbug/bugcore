/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('MultiSetMap')

//@Require('Class')
//@Require('MultiMap')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var MultiMap    = bugpack.require('MultiMap');
    var Set         = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * Map info
     * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
     * 2) Any value can be used as a key including null but not undefined.
     *
     * @class
     * @extends {MultiMap}
     */
    var MultiSetMap = Class.extend(MultiMap, {

        _name: "MultiSetMap",


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        clone: function() {
            var cloneMultiSetMap = new MultiSetMap();
            cloneMultiSetMap.putAll(this);
            return cloneMultiSetMap;
        },


        //-------------------------------------------------------------------------------
        // Map Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} key
         * @param {*} value
         * @return {*}
         */
        put: function(key, value) {
            var valueSet = this.hashTable.get(key);
            if (!valueSet) {
                valueSet = new Set();
                this.hashTable.put(key, valueSet);
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

    bugpack.export('MultiSetMap', MultiSetMap);
});
