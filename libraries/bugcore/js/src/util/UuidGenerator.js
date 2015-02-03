/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('UuidGenerator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     */
    var UuidGenerator = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {number} digitLength
     * @return {string}
     */
    UuidGenerator.generateHex = function(digitLength) {
        return Math.floor((1 + Math.random()) * Math.pow(16, digitLength))
            .toString(16)
            .substring(1);
    };

    /**
     * @static
     * @return {string}
     */
    UuidGenerator.generateHex4 = function() {
        return UuidGenerator.generateHex(4);
    };

    /**
     * @static
     * @return {string}
     */
    UuidGenerator.generateHexUuid = function() {
        return UuidGenerator.generateHex4() + UuidGenerator.generateHex4() +
            UuidGenerator.generateHex4() + UuidGenerator.generateHex4() +
            UuidGenerator.generateHex4() + UuidGenerator.generateHex4();
    };

    /**
     * @static
     * @return {string}
     */
    UuidGenerator.generateShortHexUuid = function() {
        return UuidGenerator.generateHex4() + UuidGenerator.generateHex4();
    };

    /**
     * @static
     * @return {string}
     */
    UuidGenerator.generateUuid = function() {
        return  UuidGenerator.generateHex4() + UuidGenerator.generateHex4() + '-' +
            UuidGenerator.generateHex4() + '-' + UuidGenerator.generateHex4() + '-' +
            UuidGenerator.generateHex4() + '-' +
            UuidGenerator.generateHex4() + UuidGenerator.generateHex4() + UuidGenerator.generateHex4();
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('UuidGenerator', UuidGenerator);
});
