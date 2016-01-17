/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObjectIterator')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Exception')
//@Require('IKeyValueIterator')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgumentBug         = bugpack.require('ArgumentBug');
    var Class               = bugpack.require('Class');
    var Exception           = bugpack.require('Exception');
    var IKeyValueIterator   = bugpack.require('IKeyValueIterator');
    var Obj                 = bugpack.require('Obj');
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
            var _this = this._super();

            if (_this) {
                if (TypeUtil.isObject(object)) {
                    _this.object = object;
                    _this.properties = ObjectUtil.getProperties(object, {own: true});
                    _this.propertyCount = _this.properties.length;
                } else {
                    throw new ArgumentBug(ArgumentBug.ILLEGAL, "object", object, "parameter must be an Object");
                }
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
            return this.object[key];
        },

        /**
         * @return {string}
         */
        nextKey: function() {
            if (this.hasNext()) {
                this.index++;
                return this.properties[this.index];
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
