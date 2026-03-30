function BasicCrittercismClass() {
    var errorCallback = null;
    var platform = null;
    var netStatCallback = null;
    var apm;

    /*
     * Stack trace stuff starts here
     */

    // Domain Public by Eric Wendelin http://eriwen.com/ (2008)
    //                  Luke Smith http://lucassmith.name/ (2008)
    //                  Loic Dachary <loic@dachary.org> (2008)
    //                  Johan Euphrosine <proppy@aminche.com> (2008)
    //                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
    //                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)
    /**
     * Main function giving a function stack trace with a forced or passed in Error
     *
     * @cfg {Error} e The error to create a stacktrace from (optional)
     * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
     * @return {Array} of Strings with functions, lines, files, and arguments where possible
     */
    function printStackTrace(options) {
        options = options || {guess: true};
        var ex = options.e || null, guess = !!options.guess;
        var p = new printStackTrace.implementation(), result = p.run(ex);
        return (guess) ? p.guessAnonymousFunctions(result) : result;
    }

    printStackTrace.implementation=function(){};printStackTrace.implementation.prototype={run:function(ex,mode){ex=ex||this.createException();mode=mode||this.mode(ex);if(mode==='other'){return this.other(arguments.callee);}else{return this[mode](ex);}},createException:function(){try{this.undef();}catch(e){return e;}},mode:function(e){if(e['arguments']&&e.stack){return'chrome';}else if(typeof e.message==='string'&&typeof window!=='undefined'&&window.opera){if(!e.stacktrace){return'opera9';}if(e.message.indexOf('\n')>-1&&e.message.split('\n').length>e.stacktrace.split('\n').length){return'opera9';}if(!e.stack){return'opera10a';}if(e.stacktrace.indexOf("called from line")<0){return'opera10b';}return'opera11';}else if(e.stack){return'firefox';}return'other';},instrumentFunction:function(context,functionName,callback){context=context||window;var original=context[functionName];context[functionName]=function instrumented(){callback.call(this,printStackTrace().slice(4));return context[functionName]._instrumented.apply(this,arguments);};context[functionName]._instrumented=original;},deinstrumentFunction:function(context,functionName){if(context[functionName].constructor===Function&&context[functionName]._instrumented&&context[functionName]._instrumented.constructor===Function){context[functionName]=context[functionName]._instrumented;}},chrome:function(e){var stack=(e.stack+'\n').replace(/^\S[^\(]+?[\n$]/gm,'').replace(/^\s+(at eval )?at\s+/gm,'').replace(/^([^\(]+?)([\n$])/gm,'{anonymous}()@$1$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,'{anonymous}()@$1').split('\n');stack.pop();return stack;},firefox:function(e){return e.stack.replace(/(?:\n@:0)?\s+$/m,'').replace(/^\(/gm,'{anonymous}(').split('\n');},opera11:function(e){var ANON='{anonymous}',lineRE=/^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;var lines=e.stacktrace.split('\n'),result=[];for(var i=0,len=lines.length;i<len;i+=2){var match=lineRE.exec(lines[i]);if(match){var location=match[4]+':'+match[1]+':'+match[2];var fnName=match[3]||"global code";fnName=fnName.replace(/<anonymous function: (\S+)>/,"$1").replace(/<anonymous function>/,ANON);result.push(fnName+'@'+location+' -- '+lines[i+1].replace(/^\s+/,''));}}return result;},opera10b:function(e){var lineRE=/^(.*)@(.+):(\d+)$/;var lines=e.stacktrace.split('\n'),result=[];for(var i=0,len=lines.length;i<len;i++){var match=lineRE.exec(lines[i]);if(match){var fnName=match[1]?(match[1]+'()'):"global code";result.push(fnName+'@'+match[2]+':'+match[3]);}}return result;},opera10a:function(e){var ANON='{anonymous}',lineRE=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;var lines=e.stacktrace.split('\n'),result=[];for(var i=0,len=lines.length;i<len;i+=2){var match=lineRE.exec(lines[i]);if(match){var fnName=match[3]||ANON;result.push(fnName+'()@'+match[2]+':'+match[1]+' -- '+lines[i+1].replace(/^\s+/,''));}}return result;},opera9:function(e){var ANON='{anonymous}',lineRE=/Line (\d+).*script (?:in )?(\S+)/i;var lines=e.message.split('\n'),result=[];for(var i=2,len=lines.length;i<len;i+=2){var match=lineRE.exec(lines[i]);if(match){result.push(ANON+'()@'+match[2]+':'+match[1]+' -- '+lines[i+1].replace(/^\s+/,''));}}return result;},other:function(curr){var ANON='{anonymous}',fnRE=/function\s*([\w\-$]+)?\s*\(/i,stack=[],fn,args,maxStackSize=10;while(curr&&curr['arguments']&&stack.length<maxStackSize){fn=fnRE.test(curr.toString())?RegExp.$1||ANON:ANON;args=Array.prototype.slice.call(curr['arguments']||[]);stack[stack.length]=fn+'('+this.stringifyArguments(args)+')';curr=curr.caller;}return stack;},stringifyArguments:function(args){var result=[];var slice=Array.prototype.slice;for(var i=0;i<args.length;++i){var arg=args[i];if(arg===undefined){result[i]='undefined';}else if(arg===null){result[i]='null';}else if(arg.constructor){if(arg.constructor===Array){if(arg.length<3){result[i]='['+this.stringifyArguments(arg)+']';}else{result[i]='['+this.stringifyArguments(slice.call(arg,0,1))+'...'+this.stringifyArguments(slice.call(arg,-1))+']';}}else if(arg.constructor===Object){result[i]='#object';}else if(arg.constructor===Function){result[i]='#function';}else if(arg.constructor===String){result[i]='"'+arg+'"';}else if(arg.constructor===Number){result[i]=arg;}}}return result.join(',');},sourceCache:{},ajax:function(url){var req=this.createXMLHTTPObject();if(req){try{req.open('GET',url,false);req.send(null);return req.responseText;}catch(e){}}return'';},createXMLHTTPObject:function(){var xmlhttp,XMLHttpFactories=[function(){return new XMLHttpRequest();},function(){return new ActiveXObject('Msxml2.XMLHTTP');},function(){return new ActiveXObject('Msxml3.XMLHTTP');},function(){return new ActiveXObject('Microsoft.XMLHTTP');}];for(var i=0;i<XMLHttpFactories.length;i++){try{xmlhttp=XMLHttpFactories[i]();this.createXMLHTTPObject=XMLHttpFactories[i];return xmlhttp;}catch(e){}}},isSameDomain:function(url){return typeof location!=="undefined"&&url.indexOf(location.hostname)!==-1;},getSource:function(url){if(!(url in this.sourceCache)){this.sourceCache[url]=this.ajax(url).split('\n');}return this.sourceCache[url];},guessAnonymousFunctions:function(stack){for(var i=0;i<stack.length;++i){var reStack=/\{anonymous\}\(.*\)@(.*)/,reRef=/^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,frame=stack[i],ref=reStack.exec(frame);if(ref){var m=reRef.exec(ref[1]);if(m){var file=m[1],lineno=m[2],charno=m[3]||0;if(file&&this.isSameDomain(file)&&lineno){var functionName=this.guessAnonymousFunction(file,lineno,charno);stack[i]=frame.replace('{anonymous}',functionName);}}}}return stack;},guessAnonymousFunction:function(url,lineNo,charNo){var ret;try{ret=this.findFunctionName(this.getSource(url),lineNo);}catch(e){ret='getSource failed with url: '+url+', exception: '+e.toString();}return ret;},findFunctionName:function(source,lineNo){var reFunctionDeclaration=/function\s+([^(]*?)\s*\(([^)]*)\)/;var reFunctionExpression=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/;var reFunctionEvaluation=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/;var code="",line,maxLines=Math.min(lineNo,20),m,commentPos;for(var i=0;i<maxLines;++i){line=source[lineNo-i-1];commentPos=line.indexOf('//');if(commentPos>=0){line=line.substr(0,commentPos);}if(line){code=line+code;m=reFunctionExpression.exec(code);if(m&&m[1]){return m[1];}m=reFunctionDeclaration.exec(code);if(m&&m[1]){return m[1];}m=reFunctionEvaluation.exec(code);if(m&&m[1]){return m[1];}}}return'(?)';}};
    /****** end public domain *****/

    function cleanStackTrace (stack) {
        var cleanStack = [];
        var regexFilters = [/^crittercismErrorHandler/i, /^printStackTrace/i];
        for (var i = 0, l = stack.length; i < l; i++) {
            var line = stack[i];

            var filter = false;
            // run against regex filters, break if doesnt match
            for (var j = 0, r = regexFilters.length; j < r; j++) {
                if(line.match(regexFilters[j])) {
                    filter = true;
                    break;
                }
            }

            if(!filter) {
                cleanStack.push(line);
            }
        }

        return cleanStack;
    }

    // Hack together a Chrome-style error object for uncaught errors that occur
    // on older Android platforms. This makes parsing on the Java end easier. We
    // can't get class names or methods, but we can at least get the file name/url
    // and line number.
    function massageStack(errorMsg, url, lineNumber) {
        var errorObj = new Error(errorMsg);
        errorObj.fileName = url;
        errorObj.lineNumber = lineNumber;
        var stack = '';
        stack += errorMsg;
        stack += '\n';
        stack += '    at ' + url + ':' + lineNumber + ':-1';
        errorObj.stack = stack;
        return errorObj;
    }

    function crittercismErrorHandler(errorMsg, url,lineNumber, col, errorObj) {
        var fallback = (platform === 'android') ? massageStack(errorMsg, url, lineNumber) : errorMsg;
        var stack = cleanStackTrace(printStackTrace({e:errorObj || fallback, guess: true}));
        stack.shift();
        var stackAsString = stack.join('\r\n');
        if (errorCallback) {
            errorCallback(errorMsg, stackAsString);
        }
    }

    this.instrumentOnError = function instrumentOnError(options) {
        var oldErrorHandler = window.onerror;
        window.onerror = function crOnError(msg, url, line, col, errorObj) {
            crittercismErrorHandler(msg, url, line, col, errorObj);
            if (oldErrorHandler) {
                oldErrorHandler(msg, url, line, col, errorObj);
            }
        };
        errorCallback = options.errorCallback;
        platform = options.platform;
    }

  // APM

  function dateToISOString(date) {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    return date.getUTCFullYear() +
      '-' + pad(date.getUTCMonth() + 1) +
      '-' + pad(date.getUTCDate()) +
      'T' + pad(date.getUTCHours()) +
      ':' + pad(date.getUTCMinutes()) +
      ':' + pad(date.getUTCSeconds()) +
      '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
      'Z';
  }

  this.dateToISOString = dateToISOString;

  function APM() {
    function getXMLHttpRequest() {

      var tmpXHR, cloneTest, XMLHttpRequestFactoryCandidates = [
        function () {
          return window.XMLHttpRequest;
        },
        function () {
          return window.ActiveXObject('Msxml2.XMLHTTP');
        },
        function () {
          return window.ActiveXObject('Msxml3.XMLHTTP');
        },
        function () {
          return window.ActiveXObject('Microsoft.XMLHTTP');
        }
      ];

      for (var i = 0; i < XMLHttpRequestFactoryCandidates.length; i++) {
        try {
          tmpXHR = XMLHttpRequestFactoryCandidates[i]();

          cloneTest = new tmpXHR();

          return tmpXHR;
        } catch (e) {
        }
      }
      return null;
    }

    function getByteSize(data) {
      var answer = 0;
      try {
        if (data) {
          if ((typeof data) == 'string') { // Specific to DOMString/JSON
            answer = data.length;
          } else if (data.byteLength) { // Specific to ArrayBuffer/ArrayBufferView
            answer = data.byteLength;
          } else if (data.size) { // Specific to Blob
            answer = data.size;
          } else {
            // TODO: document/ formdata check here?
            // When the default XMLHttpRequest is used to send data that isn't standard, the browser
            // sends the toString() size as the Content-Length. However, jQuery ajax sends null for the
            // data non-standard object. Since I don't have the resources/time to check if an XHR was
            // called with the jQuery API and because $.ajax methods are as a 'rule' not to be used
            // with XMLHttpRequest objects, I simply check that jQuery exists and assume the user to
            // use only the jQuery API calls. Otherwise, do the default browser send behavior.
            if (!window.jQuery) {
              answer = getByteSize(data.toString());
            }
          }
        }
      } catch (e) {
      }
      return answer;
    }

    function installAPM() {
      var originalXMLHttpRequest = getXMLHttpRequest();

      if (!originalXMLHttpRequest) {
        // MLHttpRequest missing. Crittercism service monitoring will not be installed.
        return;
      }

      if ((typeof originalXMLHttpRequest.prototype._cr_wrapped) != 'undefined') {
        return;
      }
      originalXMLHttpRequest.prototype._cr_wrapped = true;

      originalXMLHttpRequest.prototype._cr_saved_open = originalXMLHttpRequest.prototype.open;
      originalXMLHttpRequest.prototype.open = function _cr_open() {
        if (!this._cr_stats) {
          this._cr_stats = {method: '', url: '', latency: 0, bytesRead: 0, bytesSent: 0, responseCode: 0, errorCode: 0};
        }
        this._cr_saved_open.apply(this, arguments);
        if (arguments[0] && arguments[1]) {
          this._cr_stats.method = arguments[0];
          var a = document.createElement('a');
          a.href = arguments[1];
          this._cr_stats.url = a.href;
        }
      }

      originalXMLHttpRequest.prototype._cr_saved_send = originalXMLHttpRequest.prototype.send;
      originalXMLHttpRequest.prototype.send = function _cr_send(data) {
        if (!this._cr_stats) {
          this._cr_stats = {method: '', url: '', latency: 0, bytesRead: 0, bytesSent: 0, responseCode: 0, errorCode: 0};
        }
        this._cr_stats._currentTime = new Date().getTime();

        this._cr_logLatency = function logLatency() {
          if (this._cr_stats && this._cr_stats._currentTime) {
            this._cr_stats.latency = new Date().getTime() - this._cr_stats._currentTime;
          }
        };

        this._cr_logResponse = function logResponse() {
          if (this._cr_stats) {
            this._cr_stats.responseCode = this.status;
            this._cr_stats.bytesRead = getByteSize(this.response);
            this._cr_stats.time_stamp = dateToISOString(new Date());
            this._cr_logLatency();
          }
        };

        this._cr_saved_onabort = this.onabort;
        this.onabort = function () {
          this._cr_errorCode = 602;
          if (this._cr_saved_onabort) {
            this._cr_saved_onabort.apply(this, arguments);
          }
        };

        this._cr_saved_onerror = this.onerror;
        this.onerror = function (event) {
          this._cr_errorCode = 601;
          if (this._cr_saved_onerror) {
            this._cr_saved_onerror.apply(this, arguments);
          }
        };

        this._cr_saved_onloadend = this.onloadend;
        this.onloadend = function () {
          this._cr_logResponse();
          if (this._cr_errorCode) {
            this._cr_stats.errorCode = this._cr_errorCode;
          }
          this._cr_logLatency();
          if (this._cr_stats && this._cr_stats.url) {
            if (netStatCallback) {
              netStatCallback(
                this._cr_stats.method,
                this._cr_stats.url,
                this._cr_stats.latency,
                this._cr_stats.bytesRead,
                this._cr_stats.bytesSent,
                this._cr_stats.responseCode,
                this._cr_stats.errorCode);
            }
          }
          if (this._cr_saved_onloadend) {
            this._cr_saved_onloadend.apply(this, arguments);
          }
        };

        this._cr_saved_onprogress = this.onprogress;
        this.onprogress = function () {
          this._cr_logLatency();
          if (this._cr_saved_onprogress) {
            this._cr_saved_onprogress.apply(this, arguments);
          }
        };

        this._cr_saved_ontimeout = this.ontimeout;
        this.ontimeout = function () {
          this._cr_errorCode = 603;
          if (this._cr_saved_ontimeout) {
            this._cr_saved_ontimeout.apply(this, arguments);
          }
        };

        this._cr_saved_onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function crittercismXHROnReadyStateChange() {
          if (this.readyState == 2 || this.readyState == 3) {
            this._cr_logLatency();
          }
          if (this.readyState == 4) {
            this._cr_logResponse();
          }
          if (this._cr_saved_onreadystatechange) {
            this._cr_saved_onreadystatechange.apply(this, arguments);
          }
        };

        this._cr_stats.bytesSent = getByteSize(data);
        this._cr_saved_send.apply(this, arguments);
      };

    }

    installAPM();
  }

  this.APM = APM;

  // sendNetStat
  
  function _getStringPrimitive(strObj) {
    if (typeof(strObj) == 'string') {
      return strObj;
    } else if (strObj instanceof String) {
      return strObj.toString();
    }
    return null;
  }

  function sendNetStat(method, url, latency,
      bytesRead, bytesSent, responseCode, errorCode) {
    var methodStr = _getStringPrimitive(method);
    var urlStr = _getStringPrimitive(url);
    var latencyInt = parseInt(latency);
    var bytesReadInt = parseInt(bytesRead);
    var bytesSentInt = parseInt(bytesSent);
    var responseCodeInt = parseInt(responseCode);
    var errorCodeInt = parseInt(errorCode);
    console.log("method: " + method + ", methodStr: " + methodStr);
    console.log("url: " + url + ", urlStr: " + urlStr);
    console.log("latency: " + latency + ", latencyInt: " + latencyInt);
    console.log("bytesRead: " + bytesRead + ", bytesReadInt: " + bytesReadInt);
    console.log("bytesSent: " + bytesSent + ", bytesSentInt: " + bytesSentInt);
    console.log("responseCode: " + responseCode + ", responseCodeInt: " + responseCodeInt);
    console.log("errorCode: " + errorCode + ", errorCodeInt: " + errorCodeInt);
    _crttr.logNetworkRequest(methodStr, urlStr, latencyInt,
      bytesReadInt, bytesSentInt, responseCodeInt, errorCodeInt);
  }

  // initApm

  this.initApm = function initApm() {
    // Initialize Crittercism library .
    // Register unhandled exception handler
    if (typeof(_crttr) != 'undefined') {
      netStatCallback = sendNetStat;
    }
    apm = new APM();
    return this;
  };
};

BasicCrittercism = new BasicCrittercismClass();

