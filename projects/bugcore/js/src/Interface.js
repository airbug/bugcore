//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Interface')

//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var TypeUtil    = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 */
var Interface   = function() {};

var InterfaceStatic = {
    getBugPackKey: function() {

        //NOTE BRN: Perform this check for backwards compatibility with bugpack <= 0.0.5

        if (this._bugPack) {
            return this._bugPack.bugPackKey;
        } else {
            return this;
        }
    }
};


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {Object} declaration
 * @return {Function}
 */
Interface.declare = function(declaration) {
    var prototype = {};
    for (var name in declaration) {
        if (TypeUtil.isFunction(declaration[name])) {
            prototype[name] = declaration[name];
        } else {
            throw new Error("Interface can only declare functions");
        }
    }
    var newInterface = function() {};
    newInterface.prototype = prototype;
    newInterface.constructor = newInterface;
    Interface.static(newInterface, InterfaceStatic);
    return newInterface;
};

/**
 * @static
 * @param {Interface} _interface
 * @param {Object} declaration
 * @return {Function}
 */
Interface.extend = function(_interface, declaration) {
    var prototype = new _interface();
    for (var name in declaration) {
        if (TypeUtil.isFunction(declaration[name])) {
            prototype[name] = declaration[name];
        } else {
            throw new Error("Interface can only declare functions");
        }
    }
    var newInterface = function() {};
    newInterface.prototype = prototype;
    newInterface.constructor = newInterface;
    Interface.static(newInterface, InterfaceStatic);
    return newInterface;
};

/**
 * @static
 * @param {Interface} _interface
 * @param {Object} declaration
 */
Interface.static = function(_interface, declaration) {
    for (var name in declaration) {
        _interface[name] = declaration[name];
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Interface', Interface);
