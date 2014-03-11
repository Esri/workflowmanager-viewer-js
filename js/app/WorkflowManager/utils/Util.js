define(function() {
    return {
        
        readCookie: function(name) {
            if (name == '')
                return ('');
    
            var name_index = document.cookie.indexOf(name + '=');
    
            if (name_index == -1)
                return ('');
    
            var cookie_value = document.cookie.substr(name_index + name.length + 1, document.cookie.length);
            
            var end_of_cookie = cookie_value.indexOf(';');
            if (end_of_cookie != -1)
                cookie_value = cookie_value.substr(0, end_of_cookie);
    
            space = cookie_value.indexOf('+');
            while (space != -1) {
                cookie_value = cookie_value.substr(0, space) + ' ' + cookie_value.substr(space + 1, cookie_value.length);
                space = cookie_value.indexOf('+');
            }
            return (cookie_value);
        },
        
        createCookie: function(name, value) {
            if (name != '') {        
                var expiredays = 365;   // cookie expires after a year by default
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toUTCString();
            }
        },
        
        clearCookie: function(name) {
            var expires = new Date();
            expires.setYear(expires.getYear() - 1);
            document.cookie = name + '=null' + '; expires=' + expires;
        },
        
        /*
         * Returns the protocol section of the specified URL or empty string if no protocol
         * is specified.
         */
        getProtocol: function(url) {
            var index = url.indexOf(":");
            var pattern = /^[a-zA-Z]+$/g;     // pattern to allow only alpha characters (case insensitive)
            if (index > 0)
            {
                var protocol = url.substring(0, index);
                var result = protocol.match(pattern); 
                if (result && result.length == 1 && result[0] == protocol)
                {
                    return protocol;
                }
            }
            return "";
        },
        
        /*
         * Returns the absolute path to a URL.
         * 
         * Checks if the given URL has a protocol specified.  If the protocol is
         * missing from the URL (e.g. www.esri.com), the default "http://" protocol
         * will be prepended to the URL.
         */
        getAbsolutePathURL: function(url) {
            if (!this.getProtocol(url)) {
                url = "http://" + url;
            }
            return url;
        }
    };
});