//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

(function(window) {
    var bugpack     = require("bugpack").context();
    var BugCore     = bugpack.require("BugCore");
    window.bugcore = window.bugcore || BugCore.getInstance();
})(window);
