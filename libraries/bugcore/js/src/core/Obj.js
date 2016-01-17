/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Obj')

//@Require('Class')
//@Require('HashUtil')
//@Require('IClone')
//@Require('IEquals')
//@Require('IHashCode')
//@Require('IdGenerator')
//@Require('ObjectUtil')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var HashUtil        = bugpack.require('HashUtil');
    var IClone          = bugpack.require('IClone');
    var IEquals         = bugpack.require('IEquals');
    var IHashCode       = bugpack.require('IHashCode');
    var IdGenerator     = bugpack.require('IdGenerator');
    var ObjectUtil      = bugpack.require('ObjectUtil');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Constructor}
     * @implements {IClone}
     * @implements {IEquals}
     * @implements {IHashCode}
     */
    var Obj = Class.declare(/** @lends {Obj.prototype} */{

        _name: "Obj",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {?number}
             */
            this._hashCode      = null;

            // NOTE BRN: This value is set during the call to IdGenerator.ensureId(). We just put this here for clarity's sake.

            /**
             * @private
             * @type {?number}
             */
            this._internalId    = null;

            ObjectUtil.defineProperty(this, "_hashCode", {
                value : null,
                writable : true,
                enumerable : false,
                configurable : false
            });
        },


        //-------------------------------------------------------------------------------
        // Init Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Obj}
         */
        init: function() {
            this.generateInternalId();
            return this;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        getInternalId: function() {
            return this._internalId;
        },


        //-------------------------------------------------------------------------------
        // IClone Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean=} deep
         * @return {*}
         */
        clone: function(deep) {
            var _class          = this.getClass();
            var constructor     = _class.getConstructor();
            var cloneObject     = new constructor();
            ObjectUtil.forIn(this, function(key, value) {
                if (!TypeUtil.isFunction(value)) {
                    if (deep) {
                        cloneObject[key] = Obj.clone(value, deep);
                    } else {
                        cloneObject[key] = value;
                    }
                }
            });
            return cloneObject;
        },


        //-------------------------------------------------------------------------------
        // IEquals Implementation
        //-------------------------------------------------------------------------------

        /**
         * If two Objs are equal then they MUST return the same hashCode. Otherwise the world will end!
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (value !== null && value !== undefined) {
                return (value._internalId === this._internalId);
            }
            return false;
        },


        //-------------------------------------------------------------------------------
        // IHashCode Implementation
        //-------------------------------------------------------------------------------

        /**
         * Equal hash codes do not necessarily guarantee equality.
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = HashUtil.hash(this);
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        generateInternalId: function() {
            IdGenerator.ensureId(this);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(Obj, IClone);
    Class.implement(Obj, IEquals);
    Class.implement(Obj, IHashCode);


    //-------------------------------------------------------------------------------
    // Static Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {A} value
     * @param {boolean=} deep
     * @return {A}
     * @template A
     */
    Obj.clone = function(value, deep) {
        var clone = null;
        if (TypeUtil.isDate(value)) {
            clone = new Date();
            clone.setTime(value.getTime());
        } else if (TypeUtil.isObject(value)) {
            if (Class.doesImplement(value, IClone)) {
                clone = value.clone(deep);
            } else {
                clone = {};
                ObjectUtil.forIn(value, function(propertyName, propertyValue) {
                    if (deep) {
                        clone[propertyName] = Obj.clone(propertyValue, deep);
                    } else {
                        clone[propertyName] = propertyValue;
                    }
                });
            }
        } else if (TypeUtil.isArray(value)) {
            clone = [];
            for (var i = 0, size = value.length; i < size; i++) {
                var arrayValue = value[i];
                if (deep) {
                    clone.push(Obj.clone(arrayValue, deep));
                } else {
                    clone.push(arrayValue);
                }
            }
        } else {
            //TODO BRN: Any other basic types that need to be cloned?
            clone = value;
        }
        return clone;
    };

    /**
     * @static
     * @param {*} value1
     * @param {*} value2
     * @return {boolean}
     */
    Obj.equals = function(value1, value2) {
        if (Class.doesImplement(value1, IEquals)) {
            return value1.equals(value2);
        }
        var type1 = TypeUtil.toType(value1);
        var type2 = TypeUtil.toType(value2);
        if (type1 === type2) {
            switch (type1) {
                case "boolean":
                    value1 = value1.valueOf();
                    value2 = value2.valueOf();
                    break;
                case "date":
                    value1 = value1.getTime();
                    value2 = value2.getTime();
                    break;
                case "number":
                    value1 = value1 - 0;
                    value2 = value2 - 0;
                    break;
                case "string":
                    value1 = value1 + "";
                    value2 = value2 + "";
                    break;
            }
        }
        return value1 === value2;
    };

    /**
     * @static
     * @param {*} value
     * @return {number}
     */
    Obj.hashCode = function(value) {
        if (Class.doesImplement(value, IHashCode)) {
            return value.hashCode();
        } else {
            return HashUtil.hash(value);
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Obj', Obj);
});
