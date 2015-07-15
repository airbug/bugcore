/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Resolver')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('IPromise')
//@Require('List')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('ValuesResolver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil         = bugpack.require('ArgUtil');
    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var IPromise        = bugpack.require('IPromise');
    var List            = bugpack.require('List');
    var Obj             = bugpack.require('Obj');
    var TypeUtil        = bugpack.require('TypeUtil');
    var ValuesResolver  = bugpack.require('ValuesResolver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Resolver = Class.extend(Obj, {

        _name: "Resolver",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {(Array.<*> | Collection.<*>)} illegalValues
         * @param {Array.<*>} values
         */
        _constructor: function(illegalValues, values) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List.<*>}
             */
            this.illegalValues          = new List(illegalValues);

            /**
             * @private
             * @type {boolean}
             */
            this.resolved               = false;

            /**
             * @private
             * @type {boolean}
             */
            this.resolving              = false;

            /**
             * @private
             * @type {List.<*>}
             */
            this.values                 = new List(values);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List.<*>}
         */
        getIllegalValues: function() {
            return this.illegalValues;
        },

        /**
         * @return {boolean}
         */
        getResolved: function() {
            return this.resolved;
        },

        /**
         * @return {boolean}
         */
        getResolving: function() {
            return this.resolving;
        },

        /**
         * @return {List.<*>}
         */
        getValues: function() {
            return this.values;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Array.<*>, Array.<*>)} callback
         */
        resolve: function(callback) {
            if (!this.resolved && !this.resolving) {
                this.resolving = true;
                this.startResolving(callback);
            } else {
                throw new Exception("IllegalState", {}, "Resolver is already resolving.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Array.<*>, Array.<*>)} callback
         */
        startResolving: function(callback) {
            var valuesResolver = new ValuesResolver(this.illegalValues, this.values);
            valuesResolver.resolve(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Resolver', Resolver);
});
