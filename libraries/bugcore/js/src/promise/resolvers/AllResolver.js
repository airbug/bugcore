/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('AllResolver')

//@Require('Class')
//@Require('IIterable')
//@Require('Resolver')
//@Require('Throwables')
//@Require('TypeUtil')
//@Require('ValuesResolver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var IIterable       = bugpack.require('IIterable');
    var Resolver        = bugpack.require('Resolver');
    var Throwables      = bugpack.require('Throwables');
    var TypeUtil        = bugpack.require('TypeUtil');
    var ValuesResolver  = bugpack.require('ValuesResolver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Resolver}
     */
    var AllResolver = Class.extend(Resolver, {

        _name: "AllResolver",


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
                    _this.getResolvedValueList().add(undefined);
                    _this.getResolvedReasonList().add(undefined);
                    _this.resolveIterable(iterable, function(values) {
                        _this.getResolvedValueList().set(index, values);
                        _this.incrementResolvedValues();
                        _this.tryResolving(fulfilledCallback, rejectedCallback);
                    }, function(reasons) {
                        _this.getResolvedReasonList().set(index, reasons);
                        _this.incrementResolvedValues();
                        _this.tryResolving(fulfilledCallback, rejectedCallback);
                    });
                });
            } else {
                this.tryResolving(fulfilledCallback, rejectedCallback);
            }
        },

        /**
         * @private
         * @param {(Array<*> | IIterable<*>)} iterable
         * @param {function(Array.<*>)} fulfilledCallback
         * @param {function(Array.<*>)} rejectedCallback
         */
        resolveIterable: function(iterable, fulfilledCallback, rejectedCallback) {
            try {
                this.validateIterable(iterable);
                var valuesResolver = new ValuesResolver(this.getIllegalValues(), iterable);
                valuesResolver.resolve(fulfilledCallback, rejectedCallback);
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

    bugpack.export('AllResolver', AllResolver);
});
