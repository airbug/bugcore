/*
 * Copyright (c) 2016 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('RaceValuesResolver')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('IPromise')
//@Require('TypeUtil')
//@Require('ValuesResolver')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil         = bugpack.require('ArgUtil');
    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var IPromise        = bugpack.require('IPromise');
    var TypeUtil        = bugpack.require('TypeUtil');
    var ValuesResolver  = bugpack.require('ValuesResolver');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ValuesResolver}
     */
    var RaceValuesResolver = Class.extend(ValuesResolver, {

        _name: "RaceValuesResolver",


        //-------------------------------------------------------------------------------
        // Resolver Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        doResolve: function(fulfilledCallback, rejectedCallback) {
            this.resolveValues(fulfilledCallback, rejectedCallback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveValues: function(fulfilledCallback, rejectedCallback) {
            var _this = this;
            if (this.getValues().getCount() > 0) {
                this.getValues().forEach(function(value, index) {
                    _this.resolveValue(value, function(values) {
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
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('RaceValuesResolver', RaceValuesResolver);
});
