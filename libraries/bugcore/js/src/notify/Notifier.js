/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Notifier')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Notifier = Class.extend(Obj, /** @lends {Notifier.prototype} */{

        _name: 'Notifier',


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
             * @type {Array.<{
             *      acceptList: Array.<string>,
             *      callback: function(Array.<{
             *          name: string,
             *          object: Object,
             *          oldValue: *,
             *          type: string
             *      }>)
             * }>}
             */
            this.observers = [];
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Array.<{acceptList: Array.<string>, callback: (function(Array.<{name: string, object: Object, oldValue: *, type: string}>))}>}
         */
        getObservers: function() {
            return this.observers;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Array.<{
         *      name: string,
         *      object: Object,
         *      oldValue: *,
         *      type: string
         * }>)} callback
         * @param {Array.<string>=} acceptList
         */
        addObserver: function(callback, acceptList) {
            if (!acceptList) {
                acceptList = ['add', 'update', 'delete', 'reconfigure', 'setPrototype', 'preventExtensions'];
            }
            this.observers.push({
                acceptList: acceptList,
                callback: callback
            });
        },

        /**
         * @param {function(Array.<{
         *      name: string,
         *      object: Object,
         *      oldValue: *,
         *      type: string
         * }>)} callback
         */
        removeObserver: function(callback) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                var observer = this.observers[i];
                if (observer.callback === callback) {
                    this.observers.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * @param {{
         *      name: string,
         *      object: Object,
         *      oldValue: *,
         *      type: string
         * }} changeObject
         */
        notify: function (changeObject) {
            var changes = [changeObject];
            this.observers.forEach(function(observer) {
                if (observer.acceptList.indexOf(changeObject.type) > -1) {
                    observer.callback(changes);
                }
            });
        },

        /**
         * @param {string} changeType
         * @param {function():Object} changeMethod
         */
        performChange: function(changeType, changeMethod) {
            var returnedChangeObject = changeMethod();
            this.notify(returnedChangeObject);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Notifier', Notifier);
});
