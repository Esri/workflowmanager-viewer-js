define(function() {
    return {

        /**
         * Determines if one string ends with another string.
         */
        endsWith: function(str, suffix) {
            return (str != null) && (suffix != null) 
                && (str.substring(str.length - suffix.length) == suffix);
        },
        
        /**
         * Removed a string from the end 
         */
        removeFromEnd: function(str, suffix) {
            if (str != null && suffix != null) 
            {
                var i = str.indexOf(suffix);
                if (i != -1)
                    return str.substring(0, i);
            }
            return str;
        },
        
        /**
         * Determines whether two field names are equivalent.
         * Either the specified field names must be the same, or the expected field name
         * must be a suffix of the actual field name (e.g. [schema/user].[table].[field]).
         */
        isField: function(actualFieldName, expectedFieldName) {
            if (actualFieldName == null || expectedFieldName == null)
                return false;
                
            actualFieldName = actualFieldName.toUpperCase();
            expectedFieldName = expectedFieldName.toUpperCase();
            return (actualFieldName == expectedFieldName) || this.endsWith(actualFieldName, "."+expectedFieldName);
        }
       
    };
});