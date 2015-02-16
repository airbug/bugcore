/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('UuidGenerator')

//@Require('Class')
//@Require('Obj')
//@Require('RandomUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var RandomUtil  = bugpack.require('RandomUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var UuidGenerator = Class.extend(Obj, {
        _name: "UuidGenerator"
    });


    //TODO BRN: Update this using https://github.com/broofa/node-uuid/blob/master/uuid.js
    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {string}
     */
    UuidGenerator.generateHex4 = function() {
        return RandomUtil.randomHex(4);
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
