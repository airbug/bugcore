//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('LiteralUtil')

//@Require('Class')
//@Require('IArrayable')
//@Require('IObjectable')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IArrayable      = bugpack.require('IArrayable');
var IObjectable     = bugpack.require('IObjectable');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @type {{}}
 */
var LiteralUtil     = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {*} value
 * @returns {*}
 */
LiteralUtil.convertToLiteral = function(value) {
    var literal = undefined;
    if (Class.doesImplement(value, IObjectable)) {
        value = value.toObject();
    } else if (Class.doesImplement(value, IArrayable)) {
        value = value.toArray();
    }

    if (TypeUtil.isObject(value)) {
        literal = {};
        Obj.forIn(value, function(propertyName, propertyValue) {
            if (!TypeUtil.isFunction(propertyValue)) {
                literal[propertyName] = LiteralUtil.convertToLiteral(propertyValue);
            }
        });
    } else if (TypeUtil.isArray(value)) {
        literal = [];
        for (var i = 0, size = value.length; i < size; i++) {
            var arrayValue = value[i];
            literal.push(LiteralUtil.convertToLiteral(arrayValue));
        }
    } else {

        //TODO BRN: Any basic types that need to be converted?

        literal = value;
    }
    return literal
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('LiteralUtil', LiteralUtil);
