/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Object')

//@Require('Notifier')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Notifier        = bugpack.require('Notifier');


    //-------------------------------------------------------------------------------
    // Polyfill
    //-------------------------------------------------------------------------------

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function() {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString');
            var dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ];
            var dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    //if (!Object.getNotifier) {
        Object.getNotifier = function(object) {
            if (!object._notifier) {
                Object.defineProperty(object, "_notifier", {
                    value : new Notifier(),
                    writable : true,
                    enumerable : false,
                    configurable : false
                });
            }
            return object._notifier;
        };
    //}

    //if (!Object.observe) {
        Object.observe = function(obj, callback, acceptList) {
            var notifier = Object.getNotifier(obj);
            notifier.addObserver(callback, acceptList);
        };
    //}

    //if (!Object.unobserve) {
        Object.unobserve = function(obj, callback) {
            var notifier = Object.getNotifier(obj);
            notifier.removeObserver(callback);
        };
    //}


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Object', Object);
});
