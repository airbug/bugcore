/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ReflectObjectIterator')

//@Require('Class')
//@Require('Exception')
//@Require('IKeyValueIterator')
//@Require('Obj')
//@Require('ObjectUtil')
//@require('ReflectObject')
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
    var ObjectUtil          = bugpack.require('ObjectUtil');
    var ReflectObject       = bugpack.require('ReflectObject');
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
    var ReflectObjectIterator = Class.extend(Obj, {

        _name: "ReflectObjectIterator",


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
            this.index                  = -1;

            /**
             * @private
             * @type {Array.<string>}
             */
            this.properties             = [];

            /**
             * @private
             * @type {number}
             */
            this.propertyCount          = 0;

            /**
             * @private
             * @type {Object.<string, number>}
             */
            this.propertySkipCountMap   = {};

            /**
             * @private
             * @type {ReflectObject.<string, V>}
             */
            this.reflectObject          = new ReflectObject({});
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {ReflectObject.<V>} reflectObject
         * @return {ReflectObjectIterator}
         */
        init: function(reflectObject) {
            var _this = this._super();

            if (_this) {
                if (Class.doesExtend(reflectObject, ReflectObject)) {
                    this.reflectObject = reflectObject;
                    this.properties = this.reflectObject.keys();
                    this.propertyCount = this.properties.length;
                }
                this.reflectObject.observe(function (changes) {
                    changes.forEach(function (change) {
                        if (change.type === "add") {
                            _this.handlePropertyAdd(change.name);
                        } else {
                            _this.handlePropertyDelete(change.name);
                        }
                    });
                }, ["add", "delete"]);
            }

            return _this;
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

        /**
         * @return {ReflectObject.<string, V>}
         */
        getReflectObject: function() {
            return this.reflectObject;
        },


        //-------------------------------------------------------------------------------
        // IIterator Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNext: function() {
            return (this.index < (this.propertyCount - 1));
        },

        /**
         * @return {V}
         */
        next: function() {
            var key = this.nextKey();
            return this.reflectObject.getProperty(key);
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
            var value   = this.reflectObject.getProperty(key);
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

    Class.implement(ReflectObjectIterator, IKeyValueIterator);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ReflectObjectIterator', ReflectObjectIterator);
});
