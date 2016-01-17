/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RaceResolver')

//@Require('Class')
//@Require('IIterable')
//@Require('RaceValuesResolver')
//@Require('Resolver')
//@Require('Throwables')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IIterable           = bugpack.require('IIterable');
    var RaceValuesResolver  = bugpack.require('RaceValuesResolver');
    var Resolver            = bugpack.require('Resolver');
    var Throwables          = bugpack.require('Throwables');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Resolver}
     */
    var RaceResolver = Class.extend(Resolver, {

        _name: "RaceResolver",


        //-------------------------------------------------------------------------------
        // Resolver Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        doResolve: function(fulfilledCallback, rejectedCallback) {
            this.resolveIterables(fulfilledCallback, rejectedCallback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveIterables: function(fulfilledCallback, rejectedCallback) {
            var _this = this;
            if (this.getValues().getCount() > 0) {
                this.getValues().forEach(function(iterable, index) {
                    _this.raceResolveIterable(iterable, function(values) {
                        if (!_this.resolved) {
                            _this.resolved = true;
                            fulfilledCallback(values);
                        }
                    }, function(reasons) {
                        if (!_this.resolved) {
                            _this.resolved = true;
                            rejectedCallback(reasons);
                        }
                    });
                });
            } else {
                this.tryResolving(fulfilledCallback, rejectedCallback);
            }
        },

        /**
         * @private
         * @param {(Array<*> | IIterable<*>)} iterable
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        raceResolveIterable: function(iterable, fulfilledCallback, rejectedCallback) {
            try {
                this.validateIterable(iterable);
                var raceValuesResolver = new RaceValuesResolver(this.getIllegalValues(), iterable);
                raceValuesResolver.resolve(fulfilledCallback, rejectedCallback);
            } catch(error) {
                rejectedCallback([error]);
            }
        },

        /**
         * @private
         * @param iterable
         */
        validateIterable: function(iterable) {
            if (!TypeUtil.isArray(iterable) && !Class.doesImplement(iterable, IIterable)) {
                throw Throwables.bug('TypeError', {}, 'Expecting an array or an iterable object but got ' + iterable);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('RaceResolver', RaceResolver);
});
