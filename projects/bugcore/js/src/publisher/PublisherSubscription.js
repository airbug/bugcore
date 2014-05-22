/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PublisherSubscription')

//@Require('Class')
//@Require('HashUtil')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var HashUtil        = bugpack.require('HashUtil');
    var Obj             = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PublisherSubscription = Class.extend(Obj, {

        _name: "PublisherSubscription",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} topic
         * @param {function(string, PublisherMessage)} subscriberFunction
         * @param {Object} subscriberContext
         * @param {boolean} oneTimeDelivery
         */
        _constructor: function(topic, subscriberFunction, subscriberContext, oneTimeDelivery) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.oneTimeDelivery        = oneTimeDelivery || false;

            /**
             * @private
             * @type {Object}
             */
            this.subscriberContext      = subscriberContext;

            /**
             * @private
             * @type {function(string, PublisherMessage)}
             */
            this.subscriberFunction     = subscriberFunction;

            /**
             * @private
             * @type {*}
             */
            this.topic                  = topic;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getTopic: function() {
            return this.topic;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isOneTimeDelivery: function() {
            return this.oneTimeDelivery;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[PublisherSubscription]" + Obj.hashCode(this.topic) + Obj.hashCode(this.subscriberFunction) +
                    Obj.hashCode(this.subscriberContext));
            }
            return this._hashCode;
        },

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, PublisherSubscription)) {
                return (Obj.equals(this.topic, value.topic) &&
                    Obj.equals(this.subscriberFunction, value.subscriberFunction) &&
                    Obj.equals(this.subscriberContext, value.subscriberContext));
            }
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {PublisherMessage} message
         */
        deliverMessage: function(message) {
            this.subscriberFunction.call(this.subscriberContext, message);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('PublisherSubscription', PublisherSubscription);
});
