/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Url')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var TypeUtil            = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Url = Class.extend(Obj, {

        _name: "Url",


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
         *      anchor: ?string,
         *      queryKey: Object.<string, string>
         * }} urlParts
         */
        _constructor: function(urlParts) {

            this._super();

            if (!TypeUtil.isObject(urlParts)) {
                urlParts = {};
            }
            if (!TypeUtil.isString(urlParts.protocol) || urlParts.protocol === "") {
                urlParts.protocol = "http";
            }
            if (!TypeUtil.isNumber(urlParts.port) || urlParts.port <= 0) {
                urlParts.port = 80;
            }

            if (!TypeUtil.isString(urlParts.path) || urlParts.path === "") {
                urlParts.path = "/";
            }
            if (urlParts.path.substr(0, 1) !== "/") {
                urlParts.path = "/" + urlParts.path;
            }


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {?string}
             */
            this.anchor             = urlParts.anchor;

            /**
             * @private
             * @type {?string}
             */
            this.host               = urlParts.host;

            /**
             * @private
             * @type {?string}
             */
            this.path               = urlParts.path;

            /**
             * @private
             * @type {?number}
             */
            this.port               = urlParts.port - 0;

            /**
             * @private
             * @type {?string}
             */
            this.protocol           = urlParts.protocol;

            /**
             * @private
             * @type {Map.<string, string>}
             */
            this.urlQueryMap        = new Map(urlParts.queryKey);
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
         * @returns {?string}
         */
        getHost: function() {
            return this.host;
        },

        /**
         * @returns {?string}
         */
        getPath: function() {
            return this.path;
        },

        /**
         * @returns {number}
         */
        getPort: function() {
            return this.port;
        },

        /**
         * @returns {string}
         */
        getProtocol: function() {
            return this.protocol;
        },

        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {Url}
         */
        clone: function(deep) {
            var options = {
                anchor: this.getAnchor(),
                host: this.getHost(),
                path: this.getPath(),
                port: this.getPort(),
                protocol: this.getProtocol(),
                queryKey: this.urlQueryMap.toObject()
            };
            return new Url(options);
        },

        /**
         * @override
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, Url)) {
                return (Obj.equals(value.toString(), this.toString()));
            }
            return false;
        },

        /**
         * @override
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[Url]" +
                    Obj.hashCode(this.listenerFunction) + "_" +
                    Obj.hashCode(this.listenerContext));
            }
            return this._hashCode;
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
                this.urlQueryMap.forEach(function(value, key) {
                    if (first) {
                        first = false;
                        output += key + "=" + encodeURIComponent(value);
                    } else {
                        output += "&" + key + "=" + encodeURIComponent(value);
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
         * @return {string}
         */
        getUrlQuery: function(key) {
            return this.urlQueryMap.get(key);
        },

        /**
         * @param {string} key
         * @return {boolean}
         */
        hasUrlQuery: function(key) {
            return this.urlQueryMap.containsKey(key);
        },

        /**
         * @return {string}
         */
        toBaseUrlString: function() {
            return this.getProtocol() + "://" + this.toHostString();
        },

        /**
         * @return {string}
         */
        toHostString: function() {
            var hostString  = this.getHost();
            var port        = this.getPort();
            if (port !== 80) {
                hostString += ":" + port;
            }
            return hostString;
        },

        /**
         * @return {string}
         */
        toUrlString: function() {
            var urlString   = this.toBaseUrlString();
            var path        = this.getPath();
            if (path) {
                urlString += path;
            }
            return urlString;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} value
     * @return {boolean}
     */
    Url.isUrl = function(value) {
        var regex = /^((((([A-Za-z]{3,9}:(?:\/\/)?)|\/\/)(?:[-;:&=\+\$,A-Za-z0-9]+@)?([A-Za-z0-9-]*\.)*[A-Za-z0-9]+)|(?:(?:(?:\w*\.)+|[-;:&=\+\$,A-Za-z0-9]+@)([A-Za-z0-9-]*\.)*[A-Za-z0-9]+))(:(?:[0-9]+))?((?:\/[\+~=&$%\/.A-Za-z0-9-_]*)?(?:\?(?:[-\+=&;:%@.A-Za-z0-9_,]*))?(?:#(?:[A-Za-z0-9\/]*))?)?)$/;
        if (TypeUtil.isString(value)) {
            return regex.test(value);
        }
        return false;
    };

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
});
