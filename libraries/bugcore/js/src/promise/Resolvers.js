/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Resolvers')

//@Require('AllResolver')
//@Require('Class')
//@Require('Obj')
//@Require('PropsResolver')
//@Require('RaceResolver')
//@Require('ValuesResolver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AllResolver     = bugpack.require('AllResolver');
    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var PropsResolver   = bugpack.require('PropsResolver');
    var RaceResolver    = bugpack.require('RaceResolver');
    var ValuesResolver  = bugpack.require('ValuesResolver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Resolvers = Class.extend(Obj, {
        _name: "Resolvers"
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {(Array<*>)} illegalValues
     * @param {Array<(Array<*> | IIterable<*>)>} iterables
     * @return {Resolver}
     */
    Resolvers.resolveAll = function(illegalValues, iterables) {
        return new AllResolver(illegalValues, iterables);
    };

    /**
     * @static
     * @param {(Array<*>)} illegalValues
     * @param {Array<(Object<*, *> | IMap<*, *>)>} objects
     * @return {Resolver}
     */
    Resolvers.resolveProps = function(illegalValues, objects) {
        return new PropsResolver(illegalValues, objects);
    };

    /**
     * @static
     * @param {(Array<*>)} illegalValues
     * @param {Array<(Array<*> | IIterable<*>)>} iterables
     * @return {Resolver}
     */
    Resolvers.resolveRace = function(illegalValues, iterables) {
        return new RaceResolver(illegalValues, iterables);
    };

    /**
     * @static
     * @param {(Array<*>)} illegalValues
     * @param {Array<*>} values
     * @return {Resolver}
     */
    Resolvers.resolveValues = function(illegalValues, values) {
        return new ValuesResolver(illegalValues, values);
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Resolvers', Resolvers);
});
