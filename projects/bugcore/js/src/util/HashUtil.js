//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('HashUtil')

//@Require('IdGenerator')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var IdGenerator =   bugpack.require('IdGenerator');
var TypeUtil =      bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: We don't use the base level Class system here because our low level Object class depends on this class
// and Class depends on Object. Thus, if this class depends on Class it creates s circular dependency.

var HashUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {*} value
 * @return {number}
 * speed: O(1)
 */
HashUtil.hash = function(value) {
    var key     = "";
    var type    = TypeUtil.toType(value);
    switch (type) {
        case "array":
            IdGenerator.ensureId(value);
            key += "a_" + value._internalId;
            break;
        case "boolean":
            key += "b_" + value;
            break;
        case "date":
            key += "d_" + value;
            break;
        case "function":
            IdGenerator.ensureId(value);
            key += "f_" + value._internalId;
            break;
        case "number":
            key += "n_" + value;
            break;
        case "null":
            key += "null";
            break;
        case "object":
            IdGenerator.ensureId(value);
            key += "o_" + value._internalId;
            break;
        case "string":
            key += "s_" + value;
            break;
        case "undefined":
            key += "undefined";
            break;
        default:
            throw new Error("Unrecognized type to hash: " + value);
    }

    var hash = 0;
    if (key.length == 0) {
        return hash;
    }
    for (var i = 0; i < key.length; i++) {
        var char = key.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('HashUtil', HashUtil);
