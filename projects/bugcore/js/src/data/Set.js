/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/class_goog_structs_Set.html
 *
 * A Set
 * 1) Cannot contain duplicate elements.
 * 2) A 'duplicate' is considered any object where o1.equals(o2) or any primitive value where v1 === v2
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Set')

//@Require('Class')
//@Require('Collection')
//@Require('ISet')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Collection      = bugpack.require('Collection');
var ISet            = bugpack.require('ISet');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Collection.<D>}
 * @implements {ISet.<D>}
 * @template D
 */
var Set = Class.extend(Collection, {

    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {Set.<D>}
     */
    clone: function(deep) {
        var cloneSet = new Set();
        if (deep) {
            this.forEach(function(item){
                cloneSet.add(Obj.clone(item, true));
            });
        } else {
            cloneSet.addAll(this);
        }
        return cloneSet;
    },


    //-------------------------------------------------------------------------------
    // Collection Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {D} value
     * @return {boolean}
     */
    add: function(value) {
        if (!this.getHashStore().hasValue(value)) {
            this.getHashStore().addValue(value);
            return true;
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(Set, ISet);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Set', Set);
