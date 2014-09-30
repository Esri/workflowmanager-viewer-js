define(function() {
    return {

        /**
         * Determines if one string ends with another string.
         */
        endsWith: function(str, suffix) {
            return (str != null) && (suffix != null) 
                && (str.substring(str.length - suffix.length) == suffix);
        },
        /*
        public static function endsWith(str:String, suffix:String):Boolean
        {
            return (str != null) && (suffix != null) 
                && (str.substring(str.length - suffix.length) == suffix);
        }
        */
        
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
        /*
        public static function isField(actualFieldName:String, expectedFieldName:String):Boolean
        {
            if (actualFieldName == null || expectedFieldName == null)
            {
                return false;
            }
            actualFieldName = actualFieldName.toUpperCase();
            expectedFieldName = expectedFieldName.toUpperCase();
            return (actualFieldName == expectedFieldName) || endsWith(actualFieldName, "."+expectedFieldName);
        }
        */
        
    };
});