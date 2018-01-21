
# CompactHash.js
A simple javascript lib to access, modify and listen on hash changes. This lib creates customized setter and getter functions to access the hash parameters conveniently. 

# How To
## Use without prior initialization
Register an hash param with following lines:

	window.compactHash.register("ParamName");

This will create a setter and getter functions with the name you provided.  That means you can use after the registration the following functions:

	window.compactHash.setParamName("value for param ");
	and
	window.compactHash.getParamName();

You are able to listen on hash changes for the registered hash param by  registering a listener for the param.
But make sure that you register the listener with the param name at the same time.
If you already registered a hash param without the listener, just unregister it and re-register it like below:
	
	window.compactHash.register("ParamName", function(value){ console.log(value); });


## Use with prior initialization
Create an object with some settings to initialize the compactHash. Like this:

	var settings = {
            params: [{
                hashName: "p1",
                onChangedListener: function (val) {
                    console.log("M1 changed: ", val);
                }
            }, {
                hashName: "p2",
                onChangedListener: function (val) {
                    console.log("M2 changed: ", val);
                }
            }, {
                hashName: "p3",
                onChangedListener: function (val) {
                    console.log("M3 changed: ", val);
                }
            }]
        };

	window.compactHash.initialize(settings);

# Important information
Please consider the order of the parameter registrations. The order of the registration is the index of the position of the parameter value in hash. 
		
	#/c_h_/value_for_p1,value_for_p2,value_for_p3/_c_h/
Each value is URL encoded and the getter returns the value URL decoded.

If you run your application with preset hash value like the above one then you should pre-initialize the compactHash with the settings for each value otherwise the present values may be overridden. 

# Dependencies
This library uses jQuery to listen on hash changes.

# License
This library is provided under the following licence:
MIT License

Copyright (c) 2018 Paskaran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
