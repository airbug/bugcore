//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Proxy')

//@Require('Class')
//@Require('IProxy')
//@Require('Obj')
//@Require('ProxyMethod')
//@Require('ProxyObject')
//@Require('ProxyProperty')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IProxy          = bugpack.require('IProxy');
var Obj             = bugpack.require('Obj');
var ProxyMethod     = bugpack.require('ProxyMethod');
var ProxyObject     = bugpack.require('ProxyObject');
var ProxyProperty   = bugpack.require('ProxyProperty');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Proxy = Class.extend(Obj, {});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Object} proxyInstance
 * @param {(function() | Object | IProxy}} proxy
 * @param {Array<string>} functionNameArray
 */
Proxy.proxy = function(proxyInstance, proxy, functionNameArray) {
    if (!Class.doesImplement(proxy, IProxy)) {
        if (TypeUtil.isObject(proxy)) {
            proxy = Proxy.object(proxy);
        } else if (TypeUtil.isFunction(proxy)) {
            proxy = Proxy.object(proxy);
        }
    }
    for (var i = 0, size = functionNameArray.length; i < size; i++) {
        var functionName = functionNameArray[i];
        proxyInstance[functionName] = Proxy.generateProxyFunction(proxy, functionName);
    }
};

/**
 * @param {function(...)} method
 * @param {Object=} context
 * @return {*}
 */
Proxy.method = function(method, context) {
    return new ProxyMethod(method, context);
};

/**
 * @param {Object} instance
 * @return {*}
 */
Proxy.object = function(instance) {
    return new ProxyObject(instance);
};

/**
 * @param {Object} instance
 * @param {string} propertyName
 * @return {*}
 */
Proxy.property = function(instance, propertyName) {
    return new ProxyProperty(instance, propertyName);
};

/**
 * @param {IProxy} proxy
 * @return {function()}
 */
Proxy.generateProxyFunction = function(proxy, functionName) {
    if (Class.doesImplement(proxy, IProxy)) {
        return function() {
            return proxy.proxy(functionName, arguments);
        };
    } else {
        throw new Error("Proxied entities must be objects or functions.");
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Proxy', Proxy);
