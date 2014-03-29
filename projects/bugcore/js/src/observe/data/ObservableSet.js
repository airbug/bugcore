//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ObservableSet')

//@Require('Class')
//@Require('ISet')
//@Require('Obj')
//@Require('ObservableCollection')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ISet                            = bugpack.require('ISet');
var Obj                             = bugpack.require('Obj');
var ObservableCollection            = bugpack.require('ObservableCollection');
var Set                             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ObservableCollection}
 * @implements {ISet}
 */
var ObservableSet = Class.extend(ObservableCollection, /** @lends {ObservableSet.prototype} */{

    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {ObservableSet}
     */
    clone: function(deep) {
        var cloneSet = new ObservableSet();
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
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @protected
     * @param {(ICollection.<*> | Array.<*>)=} items
     */
    factoryObserved: function(items) {
        return new Set(items);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(ObservableSet, ISet);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ObservableSet', ObservableSet);
