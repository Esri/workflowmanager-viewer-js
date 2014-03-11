define("workflowmanager/_Util", [
    "dojo/_base/declare"
], function(declare) {
    return declare(null, {
        
        getDojoColor: function (colorArray) {
            colorArray[3] = colorArray[3] / 255;
            return new dojo.Color(colorArray);
        },
        
        convertIdsToString: function (ids) {
            return this.join(ids, ",");
        },
        
        convertToDate: function (dateInt) {
            if (dateInt != null) {
                return new Date(dateInt);
            }
            else {
                return null;
            }
        },
        
        formatJobQueryCSV: function (val) {
            var str = "";
            if (val) {
                if (typeof val == "string") {
                    str = val;
                } else {
                    // assume it's an array
                    try {
                        str = this.join(val, ",");
                    } catch (e) { }
                }
            }
            return str;
        },
               
        join: function (arr, joiner) {
            var str = "";
            if (arr && arr.length > 0) {
                str += arr[0];
                for (var i = 1; i < arr.length; i++) {
                    str += joiner + arr[i];
                }
            }
            return str;
        }
    });
});