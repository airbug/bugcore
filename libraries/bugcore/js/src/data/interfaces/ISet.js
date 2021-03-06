/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ISet')

//@Require('ICollection')
//@Require('Interface')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ICollection     = bugpack.require('ICollection');
    var Interface       = bugpack.require('Interface');


    //-------------------------------------------------------------------------------
    // Declare Interface
    //-------------------------------------------------------------------------------

    /**
     * @interface
     * @extends {ICollection.<I>}
     * @template I
     */
    var ISet = Interface.extend(ICollection, {
        _name: "ISet"
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('ISet', ISet);
});
