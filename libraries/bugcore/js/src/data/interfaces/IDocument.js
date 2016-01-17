/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IDocument')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Interface   = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     */
    var IDocument = Interface.declare({

        _name: "IDocument",


        //-------------------------------------------------------------------------------
        // Interface Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {*}
         */
        getData: function() {},

        /**
         * @param {*} data
         */
        setData: function(data) {},

        /**
         * @param {string} path
         * @return {*}
         */
        getPath: function(path) {},

        /**
         * @param {string} path
         * @param {*} value
         */
        setPath: function(path, value) {}
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IDocument', IDocument);
});
