//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('UrlQuery')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var UrlQuery = Class.extend(Obj, {

        _name: "UrlQuery",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} queryKey
         * @param {*} queryValue
         */
        _constructor: function(queryKey, queryValue) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.queryKey   = queryKey;

            /**
             * @private
             * @type {*}
             */
            this.queryValue  = queryValue;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {string}
         */
        getQueryKey: function() {
            return this.queryKey;
        },

        /**
         * @param {string} queryKey
         */
        setQueryKey: function(queryKey) {
            this.queryKey   = queryKey;
        },

        /**
         * @returns {*}
         */
        getQueryValue: function() {
            return this.queryValue;
        },

        /**
         * @param {*} queryValue
         */
        setQueryValue: function(queryValue) {
            this.queryValue = queryValue;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('UrlQuery', UrlQuery);
});
