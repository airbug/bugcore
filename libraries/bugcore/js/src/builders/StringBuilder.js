/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StringBuilder')

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('Proxy')
//@Require('StringUtil')
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
    var Proxy       = bugpack.require('Proxy');
    var StringUtil  = bugpack.require('StringUtil');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var StringBuilder = Class.extend(Obj, {

        _name: 'StringBuilder',


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} string
         */
        _constructor: function(string) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.string = string || '';
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getString: function() {
            return this.string;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        build: function() {
            return this.string;
        },

        /**
         * @param {string} search
         * @param {string} replacement
         * @return {StringBuilder}
         */
        replaceAll: function(search, replacement) {
            this.string = StringUtil.replaceAll(this.string, search, replacement);
            return this;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Proxy
    //-------------------------------------------------------------------------------

    Proxy.proxy(StringBuilder, Proxy.method(StringBuilder.newInstance, StringBuilder), [
        'build',
        'replaceAll'
    ]);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('StringBuilder', StringBuilder);
});
