/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashUtil')

//@Require('IdGenerator')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var IdGenerator     = bugpack.require('IdGenerator');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    // NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
    // and Class depends on Object. Thus, if this class depends on Class it creates a circular dependency.

    /**
     * @constructor
     */
    var HashUtil = function() {};


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {*} value
     * @return {number}
     */
    HashUtil.hash = function(value) {
        var key     = '';
        var type    = TypeUtil.toType(value);
        switch (type) {
        case 'arguments':
            IdGenerator.ensureId(value);
            key += 'ar_' + value._internalId;
            break;
        case 'array':
            IdGenerator.ensureId(value);
            key += 'a_' + value._internalId;
            break;
        case 'boolean':
            key += 'b_' + value;
            break;

            // TODO BRN: Dates are not immutable. Therefore we can run in to issues here if a Date is stored as
            // a key and then is changed later. We should rethink this and perhaps implement our own immutable
            // Date class.

        case 'date':
            key += 'd_' + value;
            break;
        case 'function':
            IdGenerator.ensureId(value);
            key += 'f_' + value._internalId;
            break;
        case 'number':
            key += 'n_' + value;
            break;
        case 'null':
            key += 'null';
            break;
        case 'object':
            IdGenerator.ensureId(value);
            key += 'o_' + value._internalId;
            break;
        case 'regexp':
            IdGenerator.ensureId(value);
            key += 'r_' + value._internalId;
            break;
        case 'string':
            key += 's_' + value;
            break;
        case 'undefined':
            key += 'undefined';
            break;
        default:
            throw new Error('Unrecognized type to hash: ' + value);
        }

        var hash = 0;
        if (key.length === 0) {
            return hash;
        }
        for (var i = 0, size = key.length; i < size; i++) {
            var charCode = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + charCode;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('HashUtil', HashUtil);
});
