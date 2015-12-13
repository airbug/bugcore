/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Collection  = bugpack.require('Collection');
    var ISet        = bugpack.require('ISet');
    var Obj         = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * A Set
     * 1) Cannot contain duplicate elements.
     * 2) A 'duplicate' is considered any object where o1.equals(o2) or any primitive value where v1 === v2
     *
     * @class
     * @extends {Collection.<D>}
     * @implements {ISet.<D>}
     * @template D
     */
    var Set = Class.extend(Collection, {

        _name: 'Set',


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
            if (!this.getHashStore().contains(value)) {
                this.getHashStore().add(value);
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
});
