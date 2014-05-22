/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('UnorderedPair')

//@Require('Class')
//@Require('Collection')
//@Require('IArrayable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Collection          = bugpack.require('Collection');
    var IArrayable          = bugpack.require('IArrayable');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IArrayable}
     */
    var UnorderedPair = Class.extend(Obj, {

        _name: "UnorderedPair",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} a
         * @param {*} b
         */
        _constructor: function(a ,b) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Collection.<*>}
             */
            this.pairCollection = new Collection();


            //-------------------------------------------------------------------------------
            // Add Arguments to Collection
            //-------------------------------------------------------------------------------

            this.pairCollection.addAll([a, b]);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<*>}
         */
        getValueArray: function() {
            return this.pairCollection.getValueArray();
        },


        //-------------------------------------------------------------------------------
        // IArrayable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return (Array)
         */
        toArray: function() {
            return this.getValueArray();
        },


        //-------------------------------------------------------------------------------
        // Obj Extensions
        //-------------------------------------------------------------------------------

        /**
         * @return {UnorderedPair.<*>}
         */
        clone: function() {
            var pairArray = this.toArray();
            return new UnorderedPair(pairArray[0], pairArray[1]);
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, UnorderedPair)) {
                return this.pairCollection.containsEqual(value.toArray());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[GraphNode]" + Obj.hashCode(this.value));
            }
            return this._hashCode;
        },

        /**
         * @return {string}
         */
        toString: function() {
            var output = "";
            output += "{\n";
            output += "  " + this.pairCollection.toString() + "\n";
            output += "}\n";
            return output;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        contains: function(value) {
            return this.pairCollection.contains(value);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(UnorderedPair, IArrayable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('UnorderedPair', UnorderedPair);
});
