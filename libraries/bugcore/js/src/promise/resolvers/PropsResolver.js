/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PropsResolver')

//@Require('Class')
//@Require('IMap')
//@Require('ObjectUtil')
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
    var IMap            = bugpack.require('IMap');
    var ObjectUtil      = bugpack.require('ObjectUtil');
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
    var PropsResolver = Class.extend(Resolver, {

        _name: "PropsResolver",


        //-------------------------------------------------------------------------------
        // Resolver Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        doResolve: function(fulfilledCallback, rejectedCallback) {
            this.resolveObjects(fulfilledCallback, rejectedCallback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {function(Array<*>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveObjects: function(fulfilledCallback, rejectedCallback) {
            var _this = this;
            if (this.getValues().getCount() > 0) {
                this.getValues().forEach(function(object, index) {
                    _this.getResolvedValueList().add(undefined);
                    _this.getResolvedReasonList().add(undefined);
                    _this.resolveObject(object, function(resolvedObject) {
                        _this.getResolvedValueList().set(index, resolvedObject);
                        _this.incrementResolvedValues();
                        _this.tryResolving(fulfilledCallback, rejectedCallback);
                    }, function(reasons) {
                        if (reasons.length === 1) {
                            reasons = reasons[0];
                        }
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
         * @param {(Object<*, *> | IMap<*, *>)} object
         * @param {function((Object<*, *> | IMap<*, *>))} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveObject: function(object, fulfilledCallback, rejectedCallback) {
            try {
                this.validateObject(object);
                if (Class.doesImplement(object, IMap)) {
                    this.resolveObjectAsMap(object, fulfilledCallback, rejectedCallback);
                } else {
                    this.resolveObjectAsObject(object, fulfilledCallback, rejectedCallback);
                }
            } catch(error) {
                rejectedCallback([error]);
            }
        },

        /**
         * @private
         * @param {IMap<*, *>} map
         * @param {function(IMap<*, *>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveObjectAsMap: function(map, fulfilledCallback, rejectedCallback) {
            var keys = map.toKeyArray();
            var values = [];
            keys.forEach(function(key) {
                values.push(map.get(key));
            });
            var valuesResolver = new ValuesResolver(this.getIllegalValues(), values);
            valuesResolver.resolve(function(resolvedValues) {
                keys.forEach(function(key, index) {
                    map.put(key, resolvedValues[index]);
                });
                fulfilledCallback(map);
            }, rejectedCallback);
        },

        /**
         * @private
         * @param {Object<*, *>} object
         * @param {function(Object<*, *>)} fulfilledCallback
         * @param {function(Array<*>)} rejectedCallback
         */
        resolveObjectAsObject: function(object, fulfilledCallback, rejectedCallback) {
            var properties = ObjectUtil.getProperties(object, {own: true});
            var values = [];
            properties.forEach(function(property) {
                values.push(object[property]);
            });
            var valuesResolver = new ValuesResolver(this.getIllegalValues(), values);
            valuesResolver.resolve(function(resolvedValues) {
                properties.forEach(function(property, index) {
                    object[property] = resolvedValues[index];
                });
                fulfilledCallback(object);
            }, rejectedCallback);
        },

        /**
         * @private
         * @param {*} object
         */
        validateObject: function(object) {
            if (!TypeUtil.isObject(object) && !Class.doesImplement(object, IMap)) {
                throw Throwables.bug('TypeError', {}, 'Expecting an object or an IMap but got ' + iterable);
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('PropsResolver', PropsResolver);
});
