/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Class')

//@Require('Constructor')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Constructor     = bugpack.require('Constructor');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructor
     * @param {function(new:Constructor)} constructor
     * @param {Array.<Interface>} interfaces
     * @param {string} name
     * @param {Class} superclass
     */
    var Class = function(constructor, interfaces, name, superclass) {

        /**
         * @private
         * @type {function(new:Constructor)}
         */
        this.constructor    = constructor;

        /**
         * @private
         * @type {Array.<Interface>}
         */
        this.interfaces     = interfaces;

        /**
         * @private
         * @type {string}
         */
        this.name           = name || '';

        /**
         * @private
         * @type {Class}
         */
        this.superclass     = superclass || null;
    };


    //-------------------------------------------------------------------------------
    // Prototype
    //-------------------------------------------------------------------------------

    Class.prototype = {

        /**
         * @param {*...} args
         * @return {Constructor}
         */
        alloc: function() {
            var constructor = this.getConstructor();
            return constructor.allocWithArray(arguments);
        },

        /**
         * @param {Array.<*>=} args
         * @return {Constructor}
         */
        allocWithArray: function(args) {
            var constructor = this.getConstructor();
            return constructor.allocWithArray(args);
        },

        /**
         * @return {function(new:Constructor)}
         */
        getConstructor: function() {
            return this.constructor;
        },

        /**
         * @return {Array.<Interface>}
         */
        getInterfaces: function() {
            return this.interfaces;
        },

        /**
         * @return {string}
         */
        getName: function() {
            return this.name;
        },

        /**
         * @return {Class}
         */
        getSuperclass: function() {
            return this.superclass;
        },

        /**
         * @param {*...} args
         * @return {Constructor}
         */
        newInstance: function() {
            var constructor = this.getConstructor();
            return constructor.newInstanceWithArray(arguments);
        },

        /**
         * @param {Array.<*>=} args
         * @return {Constructor}
         */
        newInstanceWithArray: function(args) {
            var constructor = this.getConstructor();
            return constructor.newInstanceWithArray(args);
        }
    };


    //-------------------------------------------------------------------------------
    // Private Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @private
     * @type {boolean}
     */
    Class.extending = false;


    //-------------------------------------------------------------------------------
    // Public Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {function(new:?)} adapteeConstructor
     * @param {Object.<string, *>} declaration
     * @return {function(new:Constructor)}
     */
    Class.adapt = function(adapteeConstructor, declaration) {
        var prototype = new adapteeConstructor();
        var newConstructor = function() {};
        for (var name in Constructor.prototype) {
            prototype[name] = Constructor.prototype[name];
        }
        prototype._constructor = function() {
            adapteeConstructor.apply(this, arguments);
        };
        Class.static(newConstructor, Constructor);
        newConstructor.prototype = prototype;
        newConstructor.constructor = newConstructor;
        return Class.extend(newConstructor, declaration);
    };

    /**
     * @static
     * @param {Object.<string, *>} declaration
     * @return {function(new:Constructor)}
     */
    Class.declare = function(declaration) {
        return Class.extend(Constructor, declaration);
    };

    /**
     * @static
     * @param {*} value
     * @param {function(new:Constructor)} constructor
     * @return {boolean}
     */
    Class.doesExtend = function(value, constructor) {
        return value instanceof constructor;
    };

    /**
     * @static
     * @param {*} value
     * @param {function(new:Implementable)} implementable
     * @return {boolean}
     */
    Class.doesImplement = function(value, implementable) {
        if (TypeUtil.isObject(value) && TypeUtil.isFunction(value.getClass)) {
            for (var i = 0, size = value.getClass().getInterfaces().length; i < size; i++) {
                var interfaceImplementable = value.getClass().getInterfaces()[i].getImplementable();
                var implementableInstance = new interfaceImplementable();
                if (implementableInstance instanceof implementable) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * @static
     * @param {function(new:Constructor)} constructor
     * @param {Object.<string, *>} declaration
     * @return {function(new:Constructor)}
     */
    Class.extend = function(constructor, declaration) {
        var _super = constructor.prototype;
        Class.extending = true;
        var prototype = new constructor();
        Class.extending = false;
        var className   = declaration['_name'];
        var newClass    = null;
        delete declaration['_name'];
        for (var name in declaration) {
            if (Object.prototype.hasOwnProperty.call(declaration, name)) {
                prototype[name] = TypeUtil.isFunction(prototype[name]) ?
                    (function(name, fn) {
                        return function() {
                            var oldSuper = this._super;
                            this._super = _super[name];
                            var returnValue = fn.apply(this, arguments);
                            this._super = oldSuper;
                            return returnValue;
                        };
                    })(name, declaration[name]) :
                    declaration[name];
            }
        }
        var newConstructor = function() {
            if (!Class.extending) {
                var _this = this;
                Object.defineProperty(this, '_class', {
                    value : newClass,
                    writable : false,
                    enumerable : false,
                    configurable : false
                });
                if (this._constructor) {
                    this._constructor.apply(this, arguments);
                }
                if (this.init && !Constructor.allocateOnly) {
                    _this = this.init.apply(this, arguments);
                }
                return _this;
            }
        };
        newConstructor.prototype = prototype;
        newConstructor.constructor = newConstructor;
        Class.static(newConstructor, Constructor);
        var superclass  = constructor.getClass();
        var interfaces  = [];
        if (superclass) {
            superclass.getInterfaces().forEach(function(_interface) {
                interfaces.push(_interface);
            });
        }
        newClass = new Class(newConstructor, interfaces, className, superclass);
        Object.defineProperty(newConstructor, '_class', {
            value : newClass,
            writable : false,
            enumerable : false,
            configurable : false
        });
        return newConstructor;
    };

    /**
     * @static
     * @param {function(new:Constructor)} constructor
     * @param {function(new:Implementable)} implementable
     */
    Class.implement = function(constructor, implementable) {
        constructor.getClass().getInterfaces().forEach(function(implementedInterface) {
            if (implementedInterface === implementable.getInterface()) {
                throw new Error('Interface "' + implementedInterface.getName() + '" has already been implemented by ' +
                    'the class "' + constructor.getClass().getName() + '"');
            }
        });
        for (var methodName in implementable.prototype) {
            if (!TypeUtil.isFunction(constructor.prototype[methodName])) {
                throw new Error('Class "' + constructor.getClass().getName() + '" does not implement method "' +
                    methodName + '" of interface "' + implementable.getInterface().getName() + '"');
            }
        }
        constructor.getClass().getInterfaces().push(implementable.getInterface());
    };

    /**
     * @static
     * @param {*} value
     */
    Class.isConstructor = function(value) {
        if (TypeUtil.isFunction(value)) {

            //TODO BRN: Test this and make sure it works....

            if (value.prototype instanceof Constructor) {
                return true;
            }
        }
        return false;
    };

    /**
     * @static
     * @param {function(new:Constructor)} constructor
     * @param {Object} declaration
     */
    Class['static'] = function(constructor, declaration) {
        for (var name in declaration) {
            if (Object.prototype.hasOwnProperty.call(declaration, name)) {
                constructor[name] = declaration[name];
            }
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Class', Class);
});
