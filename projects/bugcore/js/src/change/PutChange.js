/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PutChange')

//@Require('Change')
//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Change      = bugpack.require('Change');
    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Change}
     */
    var PutChange = Class.extend(Change, /** @lends {PutChange.prototype} */ {

        _name: "PutChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} key
         * @param {*} value
         * @param {*=} previousValue
         */
        _constructor: function (key, value, previousValue) {

            this._super(PutChange.CHANGE_TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.key            = key;

            /**
             * @private
             * @type {*}
             */
            this.previousValue  = previousValue;

            /**
             * @private
             * @type {*}
             */
            this.value          = value;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {*}
         */
        getKey: function () {
            return this.key;
        },

        /**
         * @return {*}
         */
        getPreviousValue: function () {
            return this.previousValue;
        },

        /**
         * @return {*}
         */
        getValue: function () {
            return this.value;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {PutChange}
         */
        clone: function (deep) {
            var value = this.getValue();
            if (deep) {
                value = Obj.clone(value, deep);
            }
            var key = this.getKey();
            if (deep) {
                key = Obj.clone(key, deep);
            }
            var previousValue = this.getPreviousValue();
            if (deep) {
                previousValue = Obj.clone(previousValue, deep);
            }
            return new PutChange(key, value, previousValue);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    PutChange.CHANGE_TYPE = "Put";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('PutChange', PutChange);
});