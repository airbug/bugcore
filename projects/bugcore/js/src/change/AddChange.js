//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('AddChange')

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

    var Change          = bugpack.require('Change');
    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Change}
     */
    var AddChange = Class.extend(Change, /** @lends {AddChange.prototype} */ {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {*} value
         */
        _constructor: function(value) {

            this._super(AddChange.CHANGE_TYPE);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {*}
             */
            this.value  = value;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getValue: function() {
            return this.value;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {AddChange}
         */
        clone: function(deep) {
            var value = this.getValue();
            if (deep) {
                value = Obj.clone(value, deep);
            }
            return new AddChange(value);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    AddChange.CHANGE_TYPE = "Add";


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('AddChange', AddChange);
});