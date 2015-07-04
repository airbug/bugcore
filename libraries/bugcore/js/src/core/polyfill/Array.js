/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Array')

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

    // Production steps of ECMA-262, Edition 5, 15.4.4.17
    // Reference: http://es5.github.io/#x15.4.4.17
    if (!Array.prototype.some) {
        Array.prototype.some = function(fun/*, thisArg*/) {
            'use strict';

            if (this == null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }

            if (typeof fun !== 'function') {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;

            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }


    if (!Array.getNotifier) {
        Array.getNotifier = function(object) {
            if (!object._notifier) {
                object._notifier = new Notifier();
            }
            return object._notifier;
        }
    }

    if (!Array.observe) {
        Array.observe = function(obj, callback, acceptList) {
            var notifier = Array.getNotifier(obj);
            notifier.addObserver(callback, acceptList);
        };

        var oldPop = Array.prototype.pop;
        Array.prototype.pop = function() {
            var length = this.length;
            if (length > 0) {
                var oldValue = oldPop.call(this);
                Array.getNotifier(this).notify({
                    index: length - 1,
                    object: this,
                    type: "splice",
                    removed: [oldValue]
                });
                return oldValue;
            }
            return undefined;
        };

        var oldPush = Array.prototype.push;
        Array.prototype.push = function() {
            var length = this.length;
            var returnedLength = oldPush.apply(this, arguments);
            Array.getNotifier(this).notify({
                index: length - 1,
                object: this,
                type: "splice",
                addedCount: returnedLength - length
            });
            return returnedLength;
        };

        var oldShift = Array.prototype.shift;
        Array.prototype.shift = function() {
            var length = this.length;
            if (length > 0) {
                var oldValue = oldShift.call(this);
                Array.getNotifier(this).notify({
                    index: 0,
                    object: this,
                    removed: [oldValue],
                    type: "splice"
                });
                return oldValue;
            }
            return undefined;
        };

        var oldSplice = Array.prototype.splice;
        Array.prototype.splice = function() {
            var start = arguments[0];
            var removed = oldSplice.apply(this, arguments);
            var note = {
                index: start,
                object: this,
                type: "splice"
            };
            if (removed.length > 0) {
                note.removed = removed
            }
            if (arguments.length > 2) {
                note.addedCount = arguments.length - 2;
            }
            Array.getNotifier(this).notify(note);
            return removed;
        };

        var oldUnshift = Array.prototype.unshift;
        Array.prototype.unshift = function() {
            var length = this.length;
            var returnedLength = oldUnshift.apply(this, arguments);
            Array.getNotifier(this).notify({
                index: 0,
                object: this,
                type: "splice",
                addedCount: returnedLength - length
            });
            return returnedLength;
        };
    }

    if (!Array.unobserve) {
        Array.unobserve = function(obj, callback) {
            var notifier = Array.getNotifier(obj);
            notifier.removeObserver(callback);
        };
    }

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('Array', Array);
});
