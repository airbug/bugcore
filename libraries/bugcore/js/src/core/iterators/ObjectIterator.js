/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObjectIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IKeyValueIterator')
//@Require('Obj')
//@Require('Object')
//@Require('ObjectUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var IKeyValueIterator   = bugpack.require('IKeyValueIterator');
    var Obj                 = bugpack.require('Obj');
    var Object              = bugpack.require('Object');
    var ObjectUtil          = bugpack.require('ObjectUtil');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IKeyValueIterator.<string, V>}
     * @template V
     */
    var ObjectIterator = Class.extend(Obj, {

        _name: "ObjectIterator",


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
            this.index      = -1;

            /**
             * @private
             * @type {Object.<string, V>}
             */
            this.object     = {};

            /**
             * @private
             * @type {Array.<string>}
             */
            this.properties = [];

            /**
             * @private
             * @type {number}
             */
            this.propertyCount = 0;

            /**
             * @private
             * @type {Object.<string, number>}
             */
            this.propertySkipCountMap = {};
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Object.<string, V>} object
         * @return {ObjectIterator}
         */
        init: function(object) {
            this._super();

            var _this = this;
            if (TypeUtil.isObject(object)) {
                this.object = object;
                this.properties = ObjectUtil.getOwnProperties(object);
                this.propertyCount = this.properties.length;
            }
            Object.observe(this.object, function(changes) {
                changes.forEach(function(change) {
                    if (change.type === "add") {
                        _this.handlePropertyAdd(change.name);
                    } else {
                        _this.handlePropertyDelete(change.name);
                    }
                });
            }, ["add", "delete"]);
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getIndex: function() {
            return this.index;
        },

        /**
         * @return {Object.<string, V>}
         */
        getObject: function() {
            return this.object;
        },

        /**
         * @return {Array.<string>}
         */
        getProperties: function() {
            return this.properties;
        },

        /**
         * @return {number}
         */
        getPropertyCount: function() {
            return this.propertyCount;
        },

        /**
         * @return {Object.<string, number>}
         */
        getPropertySkipCountMap: function() {
            return this.propertySkipCountMap;
        },


        //-------------------------------------------------------------------------------
        // IIterator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
           // console.log("ObjectIterator - hasNext this.index:", this.index, " this.propertyCount:", this.propertyCount);
            return (this.index < (this.propertyCount - 1));
        },

        /**
         * @return {V}
         */
        next: function() {
            var key = this.nextKey();
            return this.object[key];
        },

        /**
         * @return {string}
         */
        nextKey: function() {
            if (this.hasNext()) {
                this.index++;
                var property = this.properties[this.index];
                this.propertySkipCountMap[property]--;
                this.moveIndexToBeforeNextAvailable();
                return property;
            } else {
                throw new Exception("NoSuchElement", {}, "End of iteration reached.");
            }
        },

        /**
         * @return {{
         *      key: string,
         *      value: V
         * }}
         */
        nextKeyValuePair: function() {
            var key     = this.nextKey();
            var value   = this.object[key];
            return {
                key: key,
                value: value
            };
        },

        /**
         * @return {V}
         */
        nextValue: function() {
            return this.next();
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * O(1)
         * @private
         * @param {string} property
         */
        handlePropertyAdd: function(property) {
            this.properties.push(property);
            this.propertyCount++;
        },

        /**
         * best: O(1) worst: O(n) (if all properties have been deleted except for the next one)
         * @private
         * @param {string} property
         */
        handlePropertyDelete: function(property) {
            this.propertySkipCountMap[property] = this.propertySkipCountMap[property] ? this.propertySkipCountMap[property] + 1 : 1;
            this.moveIndexToBeforeNextAvailable();
        },

        /**
         * @private
         */
        moveIndexToBeforeNextAvailable: function() {
            var nextFound = false;
            var endFound = false;
            while (!nextFound && !endFound) {
                var nextIndex = this.index + 1;
                if (nextIndex < this.propertyCount) {
                    var property = this.properties[nextIndex];
                    if (this.propertySkipCountMap[property] !== undefined && this.propertySkipCountMap[property] > 0) {
                        this.index++;
                        this.propertySkipCountMap[property]--;
                    } else {
                        nextFound = true;
                    }
                } else {
                    endFound = true;
                }
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ObjectIterator, IKeyValueIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ObjectIterator', ObjectIterator);
});
