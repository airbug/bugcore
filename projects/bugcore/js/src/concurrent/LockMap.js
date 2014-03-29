//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('LockMap')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Lock')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug     = bugpack.require('ArgumentBug');
var Class           = bugpack.require('Class');
var Lock            = bugpack.require('Lock');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Map}
 */
var LockMap = Class.extend(Map, /** @lends {LockMap.prototype} */ {

    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {LockMap}
     */
    clone: function(deep) {
        var cloneMap = new LockMap();
        if (deep) {
            this.forEach(function(value, key) {
                cloneMap.put(Obj.clone(key, deep), Obj.clone(value, deep));
            });
        } else {
            cloneMap.putAll(this);
        }
        return cloneMap;
    },


    //-------------------------------------------------------------------------------
    // Map Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} key
     * @return {V} Returns undefined if no value is found.
     */
    get: function(key) {
        var lock = this.getHashTable().get(key);
        if (!lock) {
            lock = new Lock();
            this.put(key, lock);
        }
        return lock;
    },

    /**
     * @param {K} key
     * @param {V} value
     * @return {V}
     */
    put: function(key, value) {
        if (!Class.doesExtend(value, Lock)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "value", value, "parameter must extend Lock");
        }
        this._super(key, value);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('LockMap', LockMap);
