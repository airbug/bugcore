/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('IdGenerator')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    // NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
    // and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.

    /**
     * @constructor
     */
    var IdGenerator = function() {};


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @type {number}
     */
    IdGenerator.lastId = 0;


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Object} obj
     */
    IdGenerator.ensureId = function(obj) {
        if (obj !== null && obj !== undefined) {
            if (!obj._internalId) {
                IdGenerator.injectId(obj);
            }
        }
    };

    /**
     * @static
     * @return {number}
     */
    IdGenerator.generateId = function() {
        return IdGenerator.lastId++;
    };


    //-------------------------------------------------------------------------------
    // Private Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @param {Object} obj
     */
    IdGenerator.injectId = function(obj) {
        if (obj !== null && obj !== undefined) {
            if (!obj._internalId) {
                Object.defineProperty(obj, "_internalId", {
                    value : IdGenerator.generateId(),
                    writable : false,
                    enumerable : false,
                    configurable : false
                });
            } else {
                throw new Error("Trying to inject an id in to a object that already has one.");
            }
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('IdGenerator', IdGenerator);
});
