/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Notifying')

//@Require('Class')
//@Require('Notifier')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Notifier    = bugpack.require('Notifier');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Notifying = Class.extend(Obj, /** @lends {Notifying.prototype} */{

        _name: 'Notifying',


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
             * @type {Notifier}
             */
            this.notifier = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Notifier}
         */
        getNotifier: function() {
            if (!this.notifier) {
                this.notifier = new Notifier();
            }
            return this.notifier;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasNotifier: function() {
            return !!this.notifier;
        },

        /**
         * @param {function()} callback
         * @param {Array.<string>} acceptList
         */
        observe: function(callback, acceptList) {
            var notifier = this.getNotifier();
            notifier.addObserver(callback, acceptList);
        },

        /**
         * @param {function()} callback
         */
        unobserve: function(callback) {
            var notifier = this.getNotifier();
            notifier.removeObserver(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Notifying', Notifying);
});
