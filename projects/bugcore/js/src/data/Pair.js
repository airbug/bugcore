//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Pair')

//@Require('Class')
//@Require('Exception')
//@Require('IArrayable')
//@Require('IObjectable')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var IArrayable          = bugpack.require('IArrayable');
var IObjectable         = bugpack.require('IObjectable');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 * @implements {IArrayable}
 * @implements {IObjectable}
 */
var Pair = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {(* | Pair | {a: *, b: *})} a
     * @param {*=} b
     */
    _constructor: function(a ,b) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.a  = null;

        /**
         * @private
         * @type {*}
         */
        this.b  = null;

        if (Class.doesExtend(a, Pair)) {
            this.a = a.getA();
            this.b = a.getB();
        } else if (TypeUtil.isObject(a)) {
            this.a = a.a;
            this.b = a.b;
        } else {
            this.a = a;
            this.b = b;
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getA: function() {
        return this.a;
    },

    /**
     * @return {*}
     */
    getB: function() {
        return this.b;
    },


    //-------------------------------------------------------------------------------
    // IArrayable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Array.<*>}
     */
    toArray: function() {
        return [
            this.a,
            this.b
        ];
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @return {Object}
     */
    toObject: function() {
        return {
            a: this.a,
            b: this.b
        };
    },


    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {Pair}
     */
    clone: function(deep) {
        var a = deep ? Obj.clone(this.a, deep) : this.a;
        var b = deep ? Obj.clone(this.b, deep) : this.b;
        return new Pair(a, b);
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, Pair)) {
            return Obj.equals(value.getA(), this.a) && Obj.equals(value.getB(), this.b);
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[Pair]" + Obj.hashCode(this.a) + Obj.hashCode(this.b));
        }
        return this._hashCode;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += "[Pair] {\n";
        output += "  a: " + this.a + ",\n";
        output += "  b: " + this.b + ",\n";
        output += "}\n";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    contains: function(value) {
        return Obj.equals(value, this.a) || Obj.equals(value, this.b);
    },

    /**
     * @param {*} value
     * @return {*}
     */
    getOther: function(value) {
        if (this.contains(value)) {
            if (Obj.equals(value, this.a)) {
                return this.b;
            } else {
                return this.a;
            }
        } else {
            throw new Exception("value is not in Pair - '" + value + "'");
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Pair, IArrayable);
Class.implement(Pair, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Pair', Pair);
