/**
 * Based on the google closure library.
 * http://closure-library.googlecode.com/svn/docs/class_goog_pubsub_PubSub.html
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Publisher')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('PublisherMessage')
//@Require('PublisherSubscription')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var List                    = bugpack.require('List');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var PublisherMessage        = bugpack.require('PublisherMessage');
var PublisherSubscription   = bugpack.require('PublisherSubscription');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// NOTE BRN: The primary difference between an EventDispatcher and Publisher model is that in an EventDispatcher model
// the listener knows which object it is listening to, so it's very understood where the EventListener is receiving
// the event from. In a Publisher model, the 'listener' or receiver of a message does not know where the message originated
// from. So it is much more anonymous. This model is better for cases where any number of objects can send a message
// and you have fewer number of receivers of that message.

var Publisher = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, List.<PublisherSubscription>>}
         */
        this.topicToPublisherSubscriptionListMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} topic
     * @return {number}
     */
    getCount: function(topic) {
        if (this.topicToPublisherSubscriptionListMap.containsKey(topic)) {
            var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(topic);
            return publisherSubscriptionList.getCount();
        }
        return 0;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} topic
     */
    clear: function(topic) {
        this.topicToPublisherSubscriptionListMap.remove(topic);
    },

    /**
     *
     */
    clearAll: function() {
        this.topicToPublisherSubscriptionListMap.clear();
        this.topicToPublisherSubscriptionListMap = new Map();
    },

    /**
     * @param {string} topic
     * @param {*} data
     * @return {boolean}
     */
    publish: function(topic, data) {
        if (this.topicToPublisherSubscriptionListMap.containsKey(topic)) {
            var message = new PublisherMessage(topic, data);
            var oneTimeDeliveryPublisherSubscriptionList = new List();
            var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(topic);
            publisherSubscriptionList.forEach(function(publisherSubscription) {
                publisherSubscription.deliverMessage(message);
                if (publisherSubscription.isOneTimeDelivery()) {
                    oneTimeDeliveryPublisherSubscriptionList.add(publisherSubscription);
                }
            });
            var _this = this;
            oneTimeDeliveryPublisherSubscriptionList.forEach(function(publisherSubscription) {
                _this.removePublisherSubscription(publisherSubscription);
            });
            return true;
        }
        return false;
    },

    /**
     * Subscribing the same subscriber to the same topic will result in that subscriber being called multiple times.
     * @param {string} topic
     * @param {function(string, *)} subscriberFunction
     * @param {Object} subscriberContext
     * @return {string}
     */
    subscribe: function(topic, subscriberFunction, subscriberContext) {
        var publisherSubscription = new PublisherSubscription(topic, subscriberFunction, subscriberContext, false);
        return this.addPublisherSubscription(publisherSubscription);
    },

    /**
     * @param {string} topic
     * @param {function(string, *)} subscriberFunction
     * @param {Object} subscriberContext
     * @return {string}
     */
    subscribeOnce: function(topic, subscriberFunction, subscriberContext) {
        var publisherSubscription = new PublisherSubscription(topic, subscriberFunction, subscriberContext, true);
        return this.addPublisherSubscription(publisherSubscription);
    },

    /**
     * @param {string} topic
     * @param {function(string, *)} subscriberFunction
     * @param {Object} subscriberContext
     * @return {boolean}
     */
    unsubscribe: function(topic, subscriberFunction, subscriberContext) {
        var publisherSubscription = new PublisherSubscription(topic, subscriberFunction, subscriberContext, false);
        return this.removePublisherSubscription(publisherSubscription);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {PublisherSubscription} publisherSubscription
     */
    addPublisherSubscription: function(publisherSubscription) {
        var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(publisherSubscription.getTopic());
        if (publisherSubscriptionList === undefined) {
            publisherSubscriptionList = new List();
            this.topicToPublisherSubscriptionListMap.put(publisherSubscription.getTopic(), publisherSubscriptionList);
        }
        publisherSubscriptionList.add(publisherSubscription);
    },

    /**
     * @private
     * @param {PublisherSubscription} publisherSubscription
     */
    removePublisherSubscription: function(publisherSubscription) {
        var publisherSubscriptionList = this.topicToPublisherSubscriptionListMap.get(publisherSubscription.getTopic());
        if (publisherSubscriptionList) {
            return publisherSubscriptionList.remove(publisherSubscription);
        }
        return false;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Publisher', Publisher);
