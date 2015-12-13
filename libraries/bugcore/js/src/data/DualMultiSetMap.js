/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DualMultiSetMap')

//@Require('Class')
//@Require('DualMultiMap')
//@Require('Set')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var DualMultiMap    = bugpack.require('DualMultiMap');
    var Set             = bugpack.require('Set');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * Map info
     * 1) Supports null values but not undefined values. Undefined values are used to indicate something doesn't exist.
     * 2) Any value can be used as a key including null but not undefined.
     *
     * @class
     * @extends {DualMultiMap}
     */
    var DualMultiSetMap = Class.extend(DualMultiMap, {

        _name: 'DualMultiSetMap',


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getKeyCount: function() {
            return this.getCount();
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {DualMultiSetMap}
         */
        clone: function() {
            var cloneDualMultiSetMap = new DualMultiSetMap();
            cloneDualMultiSetMap.putAll(this);
            return cloneDualMultiSetMap;
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
            var valueCollection = this.keyValueHashTable.get(key);
            if (!valueCollection) {
                valueCollection = new Set();
                this.keyValueHashTable.put(key, valueCollection);
            }
            var result = valueCollection.add(value);
            if (result) {
                var keyCollection = this.valueKeyCollectionHashTable.get(value);
                if (!keyCollection) {
                    keyCollection = new Set();
                    this.valueKeyCollectionHashTable.put(value, keyCollection);
                }
                keyCollection.add(key);
                return value;
            }
            return undefined;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('DualMultiSetMap', DualMultiSetMap);
});
