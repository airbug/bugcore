/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ReflectArray')

//@Require('Class')
//@Require('Reflect')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Reflect     = bugpack.require('Reflect');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Reflect}
     * @template {V}
     */
    var ReflectArray = Class.extend(Reflect, /** @lends {ReflectArray.prototype} */{

        _name: "ReflectArray",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Array.<V>} array
         */
        _constructor: function(array) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<V>}
             */
            this.array = array;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<V>}
         */
        getArray: function() {
            return this.array;
        },

        /**
         * @return {number}
         */
        getLength: function() {
            return this.array.length;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(V, number)} func
         */
        forEach: function(func) {
            this.array.forEach(func);
        },

        /**
         * @param {number} index
         * @returns {V}
         */
        getAt: function(index) {
            return this.array[index];
        },

        /**
         * @param {V} value
         * @returns {number}
         */
        indexOf: function(value) {
            return this.array.indexOf(value);
        },

        /**
         * @return {V}
         */
        pop: function() {
            var length = this.getLength();
            if (length > 0) {
                var oldValue = this.array.pop();
                if (this.hasNotifier()) {
                    this.getNotifier().notify({
                        index: length - 1,
                        object: this,
                        type: "splice",
                        removed: [oldValue]
                    });
                }
                return oldValue;
            }
            return undefined;
        },

        /**
         * @param {V...} itemN
         * @return {number}
         */
        push: function(itemN) {
            var length          = this.getLength();
            var returnedLength  = this.array.push.apply(this.array, arguments);
            if (this.hasNotifier()) {
                this.getNotifier().notify({
                    index: length - 1,
                    object: this,
                    type: "splice",
                    addedCount: returnedLength - length
                });
            }
            return returnedLength;
        },

        /**
         * @param {number} index
         * @param {V} value
         * @returns {V}
         */
        setAt: function(index, value) {
            var oldValue = this.array[index];
            this.array[index] = value;
            if (this.hasNotifier()) {
                this.getNotifier().notify({
                    index: index,
                    object: this,
                    removed: [oldValue],
                    type: "splice"
                });
            }
            return oldValue;
        },

        /**
         * @return {V}
         */
        shift: function() {
            var length = this.getLength();
            if (length > 0) {
                var oldValue = this.array.shift();
                if (this.hasNotifier()) {
                    this.getNotifier().notify({
                        index: 0,
                        object: this,
                        removed: [oldValue],
                        type: "splice"
                    });
                }
                return oldValue;
            }
            return undefined;
        },

        /**
         * @param {number} start
         * @param {number} deleteCount
         * @param {V...=} itemN
         * @return {Array.<V>}
         */
        splice: function(start, deleteCount, itemN) {
            var removed = this.array.splice.apply(this.array, arguments);
            if (this.hasNotifier()) {
                var note = {
                    index: start,
                    object: this,
                    type: "splice"
                };
                if (removed.length > 0) {
                    note.removed = removed
                }
                if (arguments.length > 2) {
                    note.addedCount = arguments.length - 2;
                }
                this.getNotifier().notify(note);
            }
            return removed;
        },

        /**
         * @param {V...=} itemN
         * @return {number}
         */
        unshift: function(itemN) {
            var length          = this.getLength();
            var returnedLength  = this.array.unshift.apply(this.array, arguments);
            if (this.hasNotifier()) {
                this.getNotifier().notify({
                    index: 0,
                    object: this,
                    type: "splice",
                    addedCount: returnedLength - length
                });
            }
            return returnedLength;
        }

    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ReflectArray', ReflectArray);
});
