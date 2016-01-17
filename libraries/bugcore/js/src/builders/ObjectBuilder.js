/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObjectBuilder')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('ObjectUtil')
//@Require('Proxy')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil     = bugpack.require('ArgUtil');
    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var ObjectUtil  = bugpack.require('ObjectUtil');
    var Proxy       = bugpack.require('Proxy');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ObjectBuilder = Class.extend(Obj, {

        _name: 'ObjectBuilder',


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
             * @type {Object}
             */
            this.object = {};
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getObject: function() {
            return this.object;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {...Object} from
         * @return {ObjectBuilder}
         */
        assign: function(from) {
            var args = ArgUtil.toArray(arguments);
            ObjectUtil.assign.apply(ObjectUtil, [this.object].concat(args));
            return this;
        },

        /**
         * @return {Object}
         */
        build: function() {
            return this.object;
        },

        /**
         * @param {...Object} from
         * @return {ObjectBuilder}
         */
        merge: function(from) {
            var args = ArgUtil.toArray(arguments);
            ObjectUtil.merge.apply(ObjectUtil, [this.object].concat(args));
            return this;
        },

        /**
         * @param {...(Array.<string> | string)} properties
         * @return {ObjectBuilder}
         */
        omit: function(properties) {
            var args = ArgUtil.toArray(arguments);
            ObjectUtil.omit.apply(ObjectUtil, [this.object].concat(args));
            return this;
        },

        /**
         * @param {...(Array.<string> | string)} properties
         * @return {ObjectBuilder}
         */
        pick: function(properties) {
            var args = ArgUtil.toArray(arguments);
            ObjectUtil.pick.apply(ObjectUtil, [this.object].concat(args));
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Proxy
    //-------------------------------------------------------------------------------

    Proxy.proxy(ObjectBuilder, Proxy.method(ObjectBuilder.newInstance), [
        'assign',
        'build',
        'merge',
        'omit'
    ]);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ObjectBuilder', ObjectBuilder);
});
