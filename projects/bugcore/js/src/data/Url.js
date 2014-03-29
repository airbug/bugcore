//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Url')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')
//@Require(('UrlQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');
var UrlQuery            = bugpack.require('UrlQuery');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var Url = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {{
     *      host: ?string,
     *      path: ?string,
     *      port: ?number,
     *      protocol: ?string,
     *      anchor: ?string
     * }} options
     */
    _constructor: function(options) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {?string}
         */
        this.anchor             = "";

        /**
         * @private
         * @type {?string}
         */
        this.host               = "";

        /**
         * @private
         * @type {?string}
         */
        this.path               = "";

        /**
         * @private
         * @type {?number}
         */
        this.port               = 80;

        /**
         * @private
         * @type {?string}
         */
        this.protocol           = "http";

        /**
         * @private
         * @type {Map.<string, UrlQuery>}
         */
        this.urlQueryMap        = new Map();

        if (TypeUtil.isObject(options)) {
            var _this = this;
            if (TypeUtil.isString(options.anchor)) {
                this.setAnchor(options.anchor);
            }
            if (TypeUtil.isString(options.host)) {
                this.setHost(options.host);
            }
            if (TypeUtil.isString(options.path)) {
                this.setPath(options.path);
            }
            if (TypeUtil.isNumber(options.port - 0)) {
                this.setPort(options.port - 0);
            }
            if (TypeUtil.isString(options.protocol)) {
                this.setProtocol(options.protocol);
            }
            Obj.forIn(options.queryKey, function(key, value) {
                _this.addUrlQuery(key, value);
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {string}
     */
    getAnchor: function() {
        return this.anchor;
    },

    /**
     * @param {?string} anchor
     * @return {Url}
     */
    setAnchor: function(anchor) {
        this.anchor = anchor;
        return this;
    },

    /**
     * @returns {?string}
     */
    getHost: function() {
        return this.host;
    },

    /**
     * @param {string} host
     * @return {Url}
     */
    setHost: function(host) {
        this.host = host;
        return this;
    },

    /**
     * @returns {?string}
     */
    getPath: function() {
        return this.path;
    },

    /**
     * @param {string} path
     * @return {Url}
     */
    setPath: function(path) {
        this.path = path;
        return this;
    },

    /**
     * @returns {number}
     */
    getPort: function() {
        return this.port;
    },

    /**
     * @param {?number} port
     * @return {Url}
     */
    setPort: function(port) {
        if (!TypeUtil.isNumber(port) || port <= 0) {
            port = 80;
        }
        this.port = port;
        return this;
    },

    /**
     * @returns {string}
     */
    getProtocol: function() {
        return this.protocol;
    },

    /**
     * @param {?string} protocol
     * @return {Url}
     */
    setProtocol: function(protocol) {
        if (!TypeUtil.isString(protocol) || protocol === "") {
            protocol = "http";
        }
        this.protocol = protocol;
        return this;
    },


    //-------------------------------------------------------------------------------
    // Obj Extensions
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {Url}
     */
    clone: function(deep) {
        var urlQueryMap = {};
        this.urlQueryMap.forEach(function(urlQuery) {
            urlQueryMap[urlQuery.getQueryKey()] = urlQuery.getQueryValue();
        });

        var options = {
            anchor: this.getAnchor(),
            host: this.getHost(),
            path: this.getPath(),
            port: this.getPort(),
            protocol: this.getProtocol(),
            queryKey: urlQueryMap
        };
        return new Url(options);
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += this.getProtocol() + "://";
        output += this.getHost();
        if (this.getPort() && this.getPort() !== 80) {
            output += ":" + this.getPort();
        }
        if (this.getPath()) {
            output += this.getPath();
        }
        if (!this.urlQueryMap.isEmpty()) {
            output += "?";
            var first = true;
            this.urlQueryMap.forEach(function(urlQuery) {
                if (first) {
                    first = false;
                    output += urlQuery.getQueryKey() + "=" + encodeURIComponent(urlQuery.getQueryValue());
                } else {
                    output += "&" +urlQuery.getQueryKey() + "=" + encodeURIComponent(urlQuery.getQueryValue());
                }
            });
        }
        if (this.getAnchor()) {
            output += "#";
            output += this.getAnchor();
        }
        return output;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {*} value
     * @return {Url}
     */
    addUrlQuery: function(key, value) {
        var urlQuery    = new UrlQuery(key, value);
        this.urlQueryMap.put(key, urlQuery);
        return this;
    },

    /**
     * @param {string} key
     * @return {string}
     */
    getUrlQuery: function(key) {
        var urlQuery = this.urlQueryMap.get(key);
        if (urlQuery) {
            return urlQuery.getQueryValue();
        }
        return null;
    },

    /**
     * @param {string} key
     * @return {boolean}
     */
    hasUrlQuery: function(key) {
        return this.urlQueryMap.containsKey(key);
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} urlString
 * @param {Object=} options
 * @return {Url}
 */
Url.parse = function(urlString, options) {
    if (!options) {
        options = {};
    }
    var finalOptions = {
        strictMode: false,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {
            name:   "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };
    Obj.merge(options, finalOptions);
    var m = finalOptions.parser[finalOptions.strictMode ? "strict" : "loose"].exec(urlString);
    var uri = {};
    var i   = 14;

    while (i--) {
        uri[finalOptions.key[i]] = m[i] || "";
    }

    uri[finalOptions.q.name] = {};
    uri[finalOptions.key[12]].replace(finalOptions.q.parser, function ($0, $1, $2) {
        if ($1) uri[finalOptions.q.name][$1] = $2;
    });

    return new Url(uri);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Url', Url);
