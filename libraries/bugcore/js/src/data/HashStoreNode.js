/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashStoreNode')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @template V
     */
    var HashStoreNode = Class.extend(Obj, {

        _name: "HashStoreNode",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {number}
             */
            this.count = 0;

            /**
             * @private
             * @type {Array.<V>}
             */
            this.valueArray = [];
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getCount: function() {
            return this.count;
        },

        /**
         * @return {Array.<V>}
         */
        getValueArray: function() {
            return this.valueArray;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {number}
         */
        getValueCount: function(value) {
            var count = 0;
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                var valueArrayValue = this.valueArray[i];
                if (Obj.equals(value, valueArrayValue)) {
                    count++;
                }
            }
            return count;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, HashStoreNode)) {
                if (this.getCount() === value.getCount()) {
                    for (var i = 0, size = this.valueArray.length; i < size; i++) {
                        var valueArrayValue = this.valueArray[i];
                        if (!value.containsValue(valueArrayValue)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        },

        /**
         * @return {string}
         */
        toString: function() {
            var output = "{";
            output += "  count:" + this.getCount() + ",\n";
            output += "  values:[\n";
            this.valueArray.forEach(function(value) {
                output += value + ",";
            });
            output += "  ]";
            output += "}";
            return output;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {V} value
         */
        addValue: function(value) {
            this.valueArray.push(value);
            this.count++;
        },

        /**
         * @param {*} value
         */
        containsValue: function(value) {
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                var valueArrayValue = this.valueArray[i];
                if (Obj.equals(value, valueArrayValue)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        removeValue: function(value) {
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                var valueArrayValue = this.valueArray[i];
                if (Obj.equals(value, valueArrayValue)) {
                    this.valueArray.splice(i, 1);
                    this.count--;
                    return true;
                }
            }
            return false;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashStoreNode', HashStoreNode);
});
