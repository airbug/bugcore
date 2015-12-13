/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Streams')

//@Require('Arr')
//@Require('Class')
//@Require('Exception')
//@Require('IStreamable')
//@Require('ISupplier')
//@Require('Obj')
//@Require('Stream')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Arr             = bugpack.require('Arr');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var IStreamable     = bugpack.require('IStreamable');
    var ISupplier       = bugpack.require('ISupplier');
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
        _name: 'Streams'
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
            throw new Exception('IllegalArgument', {}, '"value" cannot be made streamable - value:' + value);
        }
    };

    /**
     * @static
     * @param {(IStreamable.<I> | ISupplier.<I>)} streamable
     * @return {Stream.<I>}
     */
    Streams.stream = function(streamable) {
        if (Class.doesImplement(streamable, IStreamable)) {
            return streamable.stream();
        } else if (Class.doesImplement(streamable, ISupplier)){
            return Stream.newStream(streamable);
        } else {
            throw new Exception('IllegalArgument', {}, 'streamable does not implement IStreamable or does not implement ISupplier');
        }
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Streams', Streams);
});
