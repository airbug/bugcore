/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

(function(window) {
    var bugpack     = require("bugpack").context();
    var BugCore     = bugpack.require("BugCore");
    window.bugcore = window.bugcore || BugCore.getInstance();
})(window);
