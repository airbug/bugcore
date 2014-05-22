/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Stack')

//@Require('Class')
//@Require('Collection')
//@Require('Exception')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Collection      = bugpack.require('Collection');
    var Exception       = bugpack.require('Exception');
    var Obj             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Collection}
     * @template C
     */
    var Stack = Class.extend(Collection, {

        _name: "Stack",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Collection.<*> | Array.<*>)} items
         */
        _constructor: function(items) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Array.<C>}
             */
            this.valueArray = [];

            if (items) {
                this.addAll(items);
            }
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @return {Array.<C>} Array is in the same order as the queue
         */
        getValueArray: function() {
            var valueArray = [];
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                valueArray.push(this.valueArray[i]);
            }
            return valueArray;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {Stack}
         */
        clone: function(deep) {
            var cloneStack = new Stack();
            if (deep) {
                this.forEach(function(item){
                    cloneStack.add(Obj.clone(item, true));
                });
            } else {
                cloneStack.addAll(this);
            }
            return cloneStack;
        },


        //-------------------------------------------------------------------------------
        // Collection Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {C} value
         * @return {boolean}
         */
        add: function(value) {
            this._super(value);
            this.valueArray.push(value);
            return true;
        },

        /**
         * @override
         * @param {function(C)} func
         */
        forEach: function(func) {
            for (var i = 0, size = this.valueArray.length; i < size; i++) {
                func(this.valueArray[i]);
            }
        },

        /**
         * Removes the FIRST occurrence of value from the stack
         * @param {*} value
         * @return {boolean}
         */
        remove: function(value) {
            if (this.contains(value)) {
                var index = this.indexOfLast(value);
                this.removeAt(index);
                return true;
            }
            return false;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        pop: function() {
            var lastIndex = this.getCount() - 1;
            if (lastIndex > -1) {
                return this.removeAt(lastIndex);
            } else {
                throw new Exception("StackEmpty", {}, "No elements left to pop");
            }
        },

        /**
         * @param {*} value
         */
        push: function(value) {
            this.add(value);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {number} index
         * @return {*}
         */
        getAt: function(index) {
            if (index < this.getCount()) {
                return this.valueArray[index];
            } else {
                throw new Exception("IndexOutOfBounds", {}, "Index out of bounds");
            }
        },

        /**
         * @private
         * @param {*} value
         * @return {number}
         */
        indexOfLast: function(value) {
            for (var i = this.valueArray.length - 1; i >= 0; i--) {
                if (Obj.equals(this.valueArray[i], value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @private
         * @param {number} index
         * @return {*} The removed value
         */
        removeAt: function(index) {
            var value = this.getAt(index);
            var result = this.getHashStore().removeValue(value);
            if (result) {
                this.valueArray.splice(index, 1);
            }
            return value;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Stack', Stack);
});
