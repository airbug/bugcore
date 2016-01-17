/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
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

    var Class       = bugpack.require('Class');
    var Collection  = bugpack.require('Collection');
    var IArrayable  = bugpack.require('IArrayable');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IArrayable.<A|B>}
     * @template A, B
     */
    var UnorderedPair = Class.extend(Obj, {

        _name: "UnorderedPair",


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
             * @type {Collection.<A|B>}
             */
            this.pairCollection = new Collection();
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {A} a
         * @param {B} b
         * @return {UnorderedPair.<A, B>}
         */
        init: function(a, b) {
            this._super();
            this.pairCollection.addAll([a, b]);
            return this;
        },



        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Collection.<A|B>}
         */
        getPairCollection: function() {
            return this.pairCollection;
        },


        //-------------------------------------------------------------------------------
        // IArrayable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return (Array.<A|B>)
         */
        toArray: function() {
            return this.pairCollection.toArray();
        },


        //-------------------------------------------------------------------------------
        // Obj Extensions
        //-------------------------------------------------------------------------------

        /**
         * @return {UnorderedPair.<A, B>}
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
                var pairArray = this.toArray();
                this._hashCode = Obj.hashCode("[UnorderedPair]" + (Obj.hashCode(pairArray[0]) + Obj.hashCode(pairArray[1])));
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
