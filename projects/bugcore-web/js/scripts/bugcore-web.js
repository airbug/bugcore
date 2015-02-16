/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
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
