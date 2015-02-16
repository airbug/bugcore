/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RemoveAtChange')

//@Require('Class')
//@Require('Obj')
//@Require('RemoveChange')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var RemoveChange    = bugpack.require('RemoveChange');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {RemoveChange}
     */
    var RemoveAtChange = Class.extend(RemoveChange, /** @lends {RemoveAtChange.prototype} */ {

        _name: "RemoveAtChange",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} value
         * @param {number} index
         */
        _constructor: function(value, index) {

            this._super(value);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {number}
             */
            this.index = index;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getIndex: function () {
            return this.index;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {RemoveAtChange}
         */
        clone: function (deep) {
            var value = this.getValue();
            if (deep) {
                value = Obj.clone(value, deep);
            }
            return new RemoveAtChange(this.getObjectPath(), value, this.getIndex());
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('RemoveAtChange', RemoveAtChange);
});
