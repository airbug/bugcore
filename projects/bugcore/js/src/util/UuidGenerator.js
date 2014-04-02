//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 */
var UuidGenerator = {

    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @return {string}
     */
    generateHex4: function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    },

    /**
     * @static
     * @return {string}
     */
    generateHexUuid: function() {
        return UuidGenerator.generateHex4() + UuidGenerator.generateHex4() +
            UuidGenerator.generateHex4() + UuidGenerator.generateHex4() +
            UuidGenerator.generateHex4() + UuidGenerator.generateHex4();
    },

    /**
     * @static
     * @return {string}
     */
    generateShortHexUuid: function() {
        return UuidGenerator.generateHex4() + UuidGenerator.generateHex4();
    },

    /**
     * @static
     * @return {string}
     */
    generateUuid: function() {
        return  UuidGenerator.generateHex4() + UuidGenerator.generateHex4() + '-' +
            UuidGenerator.generateHex4() + '-' + UuidGenerator.generateHex4() + '-' +
            UuidGenerator.generateHex4() + '-' +
            UuidGenerator.generateHex4() + UuidGenerator.generateHex4() + UuidGenerator.generateHex4();
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('UuidGenerator', UuidGenerator);
