/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

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
     * @implements {ISet.<I>}
     */
    var ObservableSet = Class.extend(ObservableCollection, /** @lends {ObservableSet.prototype} */{

        _name: "ObservableSet",


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
});
