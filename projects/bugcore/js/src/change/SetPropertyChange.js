/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('SetPropertyChange')

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
    var SetPropertyChange = Class.extend(Change, /** @lends {SetPropertyChange.prototype} */{

        _name: "SetPropertyChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         * @param {*} propertyValue
         * @param {*} previousValue
         */
        _constructor: function (propertyName, propertyValue, previousValue) {

            this._super(SetPropertyChange.CHANGE_TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.previousValue      = previousValue;

            /**
             * @private
             * @type {string}
             */
            this.propertyName       = propertyName;

            /**
             * @private
             * @type {*}
             */
            this.propertyValue      = propertyValue;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getPreviousValue: function () {
            return this.previousValue;
        },

        /**
         * @return {string}
         */
        getPropertyName: function () {
            return this.propertyName;
        },

        /**
         * @return {*}
         */
        getPropertyValue: function () {
            return this.propertyValue;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {SetPropertyChange}
         */
        clone: function (deep) {
            var propertyValue = this.getPropertyValue();
            if (deep) {
                propertyValue = Obj.clone(propertyValue, deep);
            }
            var previousValue = this.getPreviousValue();
            if (deep) {
                previousValue = Obj.clone(previousValue, deep);
            }
            return new SetPropertyChange(this.getPropertyName(), propertyValue, previousValue);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    SetPropertyChange.CHANGE_TYPE = "SetProperty";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('SetPropertyChange', SetPropertyChange);
});
