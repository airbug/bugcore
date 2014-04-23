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
     * @return {string}
     */
    UuidGenerator.generateHex4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
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
