/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Iteration')

//@Require('Class')
//@Require('Flow')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Flow    = bugpack.require('Flow');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    //NOTE BRN: An instance of this class is designed to be used only once.

    /**
     * @class
     * @extends {Flow}
     */
    var Iteration = Class.extend(Flow, {

        _name: "Iteration",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {function(Flow, *)} iteratorMethod
         */
        _constructor: function(iteratorMethod) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {function(Flow, *)}
             */
            this.iteratorMethod = iteratorMethod;
        },


        //-------------------------------------------------------------------------------
        // Flow Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {Array<*>} args
         */
        executeFlow: function(args) {
            this._super(args);
            this.iteratorMethod.apply(null, ([this]).concat(args));
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('Iteration', Iteration);
});
