/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RemovePropertyChange')

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
    var RemovePropertyChange = Class.extend(Change, /** @lends {RemovePropertyChange.prototype} */ {

        _name: "RemovePropertyChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} propertyName
         * @param {*} previousValue
         */
        _constructor: function (propertyName, previousValue) {

            this._super(RemovePropertyChange.CHANGE_TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.previousValue = previousValue;

            /**
             * @private
             * @type {string}
             */
            this.propertyName   = propertyName;
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


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {RemovePropertyChange}
         */
        clone: function (deep) {
            var previousValue = this.getPreviousValue();
            if (deep) {
                previousValue = Obj.clone(previousValue, deep);
            }
            return new RemovePropertyChange(this.getPropertyName(), previousValue);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    RemovePropertyChange.CHANGE_TYPE = "RemoveProperty";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('RemovePropertyChange', RemovePropertyChange);
});
