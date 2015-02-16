/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Proxy')

//@Require('Class')
//@Require('Exception')
//@Require('IProxy')
//@Require('Obj')
//@Require('ProxyMethod')
//@Require('ProxyObject')
//@Require('ProxyProperty')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var IProxy          = bugpack.require('IProxy');
    var Obj             = bugpack.require('Obj');
    var ProxyMethod     = bugpack.require('ProxyMethod');
    var ProxyObject     = bugpack.require('ProxyObject');
    var ProxyProperty   = bugpack.require('ProxyProperty');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Proxy = Class.extend(Obj, {
        _name: "Proxy"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Object} proxyInstance
     * @param {(function() | Object | IProxy)} proxy
     * @param {Array<string>} functionNameArray
     */
    Proxy.proxy = function(proxyInstance, proxy, functionNameArray) {
        if (!Class.doesImplement(proxy, IProxy)) {
            if (TypeUtil.isObject(proxy)) {
                proxy = Proxy.object(proxy);
            } else if (TypeUtil.isFunction(proxy)) {
                proxy = Proxy.object(proxy);
            } else {
                throw new Exception("IllegalArgument", {}, "'proxy' must implement IProxy or be and object or a function.");
            }
        }
        for (var i = 0, size = functionNameArray.length; i < size; i++) {
            var functionName = functionNameArray[i];
            proxyInstance[functionName] = Proxy.generateProxyFunction(proxy, functionName);
        }
    };

    /**
     * @static
     * @param {function(...):*} method
     * @param {Object=} context
     * @return {ProxyMethod}
     */
    Proxy.method = function(method, context) {
        return new ProxyMethod(method, context);
    };

    /**
     * @static
     * @param {Object} instance
     * @return {ProxyObject}
     */
    Proxy.object = function(instance) {
        return new ProxyObject(instance);
    };

    /**
     * @static
     * @param {Object} instance
     * @param {string} propertyName
     * @return {ProxyProperty}
     */
    Proxy.property = function(instance, propertyName) {
        return new ProxyProperty(instance, propertyName);
    };

    /**
     * @static
     * @param {IProxy} proxy
     * @param {string} functionName
     * @return {function(...):*}
     */
    Proxy.generateProxyFunction = function(proxy, functionName) {
        if (Class.doesImplement(proxy, IProxy)) {
            return function() {
                return proxy.proxy(functionName, arguments);
            };
        } else {
            throw new Exception("IllegalArgument", {}, "'proxy' must implement IProxy.");
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Proxy', Proxy);
});
