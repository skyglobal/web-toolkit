var smoax = new Smoax()

function Smoax() {
    var me = this
    var isJasmine = !!window.jasmine
    this.ajax = $.ajax
    $.ajaxTransport('mock', mockAjaxTransport)

    this.setup = function() {
        me.handlers = new AjaxMap()
        me.calls = new CallMap()
        $.ajax = wrap
        return isJasmine ? me.jasmineMatchers : me.chaiMatchers
    }

    this.release = function() {
        $.ajax = me.ajax
    }

    function mockAjaxTransport(options, originalOptions, jqXHR) {
        var abort = false
        options.dataType = originalOptions.originalDataType
        options.dataTypes = options.dataType && [options.dataType] || ['*']
        return {
            send: function(headers, complete) {
                if (abort) return
                me.calls.set(options.type, options.url, options)
                var handler = me.handlers.get(options.type, options.url)
                if (!!handler) {
                    var responses = { text:toText(handler.response) }
                    //, xml:jQuery.parseXML(handler.response) }
                    function done() {
                        complete(handler.statusCode, handler.statusText, responses, '')
                    }
                    if (handler.promise) {
                        handler.promise.done(function(response) {
                            complete(200, 'success', { text:toText(response) }, '')
                        });
                        handler.promise.fail(function(errorOptions) {
                            complete(errorOptions.statusCode, errorOptions.statusText, { text:toText(errorOptions.response) }, '')
                        })
                    } else if (handler.async !== undefined && options.async) {
                        setTimeout(done, handler.async)
                    } else {
                        done()
                    }
                } else {
                    me.warn('No mock ajax registered for '+options.type+' '+options.url)
                }
            },
            abort: function() { abort = true }
        }
    }

    function toParams(data) {
        if ($.isFunction(data)) {
            data = data()
        }
        if ($.isArray(data) || $.isPlainObject(data)) {
            return jQuery.param(data, jQuery.ajaxSettings.traditional)
        } else {
            return data
        }
    }

    function toText(resp) {
        if ($.isFunction(resp)) {
            resp = resp()
        }
        if ($.isArray(resp) || $.isPlainObject(resp)) {
            return JSON.stringify(resp)
        } else {
            return resp
        }
    }

    function wrap(opts, settings) {
        var allOpts = jQuery.ajaxSetup({}, opts)
        opts.originalDataType = allOpts.dataType
        opts.dataType = 'mock'
        return me.ajax(opts, settings)
    }

    function _register(method, url, data) {
        me.handlers.set(method, url, data)
        return me
    }
    this.register = function(method, url, response) {
        if (!url) { response = method; method = url = '*' }
        var data = { statusCode:200, statusText:'success', response:response }
        return _register(method, url, data)
    }
    this.registerDeferred = function(method, url) {
        var deferred = $.Deferred()
        _register((method || '*'), ((method && url) || '*'), { promise: deferred.promise() })
        return deferred;
    }
    this.registerAsync = function(method, url, response, timeout) {
        if (!response) { response = method; timeout = url; method = url = '*' }
        var data = { statusCode:200, statusText:'success', response:response, async:timeout || 0 }
        return _register(method, url, data)
    }
    this.registerError = function(method, url, statusCode, statusText, response) {
        if (!statusText) { response = statusCode; statusText = url; statusCode = method; method = url = '*' }
        var data = { statusCode:statusCode, statusText:statusText, response:response }
        return _register(method, url, data)
    }
    this.registerAsyncError = function(method, url, statusCode, statusText, response, timeout) {
        if (!statusText) { timeout = statusText; response = statusCode; statusText = url; statusCode = method; method = url = '*' }
        var data = { statusCode:statusCode, statusText:statusText, response:response , async:timeout || 0 }
        return _register(method, url, data)
    }

    this.warn = function(s) {
        isJasmine ? jasmine.log('smoax: '+s) : console.warn('smoax: '+s)
    }

    this.chaiMatchers = function(chai, utils) {
        chai.Assertion.addMethod('beenInvoked', function() {
            this.assert(me.calls.latest !== undefined,
                'expected ajax to have been invoked',
                'expected ajax not to have invoked'
            )
        })
        chai.Assertion.addMethod('beenInvokedWith', function(method, url, data) {
            var calls = me.calls.get(method, url)
            var result = match(calls, method, url, data, utils.objDisplay)
            var messages = result.message()
            this.assert(result.ok, messages[0], messages[1])
        })
        chai.Assertion.addMethod('latestInvocationToHaveBeen', function(method, url, data) {
            var result = match([me.calls.latest], method, url, data, utils.objDisplay)
            var messages = result.message()
            this.assert(result.ok, messages[0], messages[1])
        })
    }

    this.jasmineMatchers = {
        toHaveBeenInvoked: function() {
            this.message = function() { return [
                "Expected ajax to have been invoked.",
                "Expected ajax not to have been invoked."
            ] }
            return me.calls.latest !== undefined
        },
        latestInvocationToHaveBeen: function(method, url, data) {
            var result = match([me.calls.latest], method, url, data, jasmine.pp)
            this.message = result.message
            return result.ok
        },
        toHaveBeenInvokedWith: function(method, url, data) {
            var calls = me.calls.get(method, url)
            var result = match(calls, method, url, data, jasmine.pp)
            this.message = result.message
            return result.ok
        }
    }

    function findMatch(actualCalls, expected) {
        var methodMatch = undefined
        for (var ii in actualCalls) {
            var call = actualCalls[ii]
            var m = isMatch(call, expected)
            if (m.methodMatch && m.dataMatch) {
                return { ok: true }
            } else if (m.methodMatch) {
                methodMatch = call
            }
        }
        return { ok: false, methodMatch:methodMatch }

        function isMatch(call, expected) {
            var mm = expected.type.toUpperCase() == call.type.toUpperCase() && expected.url == call.url
            var dm = expected.data == call.data
            return { methodMatch:mm, dataMatch:dm }
        }
    }

    function match(calls, method, url, data, prettyPrint) {
        var expected = { type: method, url:url, data:toParams(data) }
        var closest = findMatch(calls, expected)
        var result = { ok: closest.ok }
        if (result.ok) {
            result.message = function() { return ['ok', 'ok'] }
        } else if (closest.methodMatch) {
            result.message = dataErrorMessages(closest.methodMatch.data, expected.data)
        } else {
            result.message = requestErrorMessages()
        }
        return result

        function requestErrorMessages() {
            function calls2string() {
                var s = ''
                for (var key in me.calls.map) { s == '' ? s = key : s = s + ', ' + key }
                return s
            }
            return function() {
                var desc = key(method, url)
                var details = me.calls.count == 0
                    && 'There have been no ajax calls.'
                    || 'There have been calls to: '+calls2string()
                return [
                    "Expected "+desc+" to have been invoked. "+details,
                    "Expected "+desc+" not to have been invoked. "+details
                ] }
        }

        function dataErrorMessages(actualData, expectedData) {
            var desc = key(method, url)
            return function() { return [
                "Expected "+desc+" to have been invoked with "+prettyPrint(expectedData)+" but was invoked with "+prettyPrint(actualData),
                "Expected "+desc+" not to have been invoked with "+prettyPrint(expectedData)
            ]}
        }
    }

    function key(method, url) {
        return method.toUpperCase()+' '+url.replace(/\?_=\d+/, '')
    }

    function AjaxMap() {
        this.map = {}

        this.get = function(method, url) {
            return this.map[key(method, url)] || this.map['* *']
        }
        this.set = function(method, url, data) {
            var k = key(method, url)
            this.map[k] = data
        }
        return this
    }

    function CallMap() {
        this.count = 0
        this.map = {}
        this.latest = undefined

        this.get = function(method, url) {
            return this.map[key(method, url)]
        }
        this.set = function(method, url, data) {
            var k = key(method, url)
            var map = this.map[k] || (this.map[k] = [])
            this.latest = data
            this.count++
            map.push(data)
        }
        return this
    }

    return this
}
