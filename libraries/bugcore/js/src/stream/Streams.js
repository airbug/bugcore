/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Collections')

//@Require('Arr')
//@Require('Class')
//@Require('Exception')
//@Require('IStreamable')
//@Require('Obj')
//@Require('Stream')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Arr             = bugpack.require('Arr');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var IStreamable     = bugpack.require('IStreamable');
    var Obj             = bugpack.require('Obj');
    var Stream          = bugpack.require('Stream');
    var TypeUtil        = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Streams = Class.extend(Obj, {
        _name: "Streams"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param value
     * @return {IStreamable}
     */
    Streams.ensureStreamable = function(value) {
        if (Class.doesImplement(value, IStreamable)) {
            return value;
        } else if (TypeUtil.isArray(value)) {
            return new Arr(value);
        } else {
            throw new Exception("IllegalArgument", {}, "'value' cannot be made streamable - value:" + value);
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Streams', Streams);
});
