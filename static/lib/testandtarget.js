var mboxCopyright = "Copyright 1996-2012. Adobe Systems Incorporated. All rights reserved.";
mboxUrlBuilder = function (a, b) {
    this.a = a;
    this.b = b;
    this.c = new Array();
    this.d = function (e) {
        return e;
    };
    this.f = null;
};
mboxUrlBuilder.prototype.addParameter = function (g, h) {
    var i = new RegExp('(\'|")');
    if (i.exec(g)) {
        throw "Parameter '" + g + "' contains invalid characters";
    }
    for (var j = 0; j < this.c.length; j++) {
        var k = this.c[j];
        if (k.name == g) {
            k.value = h;
            return this;
        }
    }
    var l = new Object();
    l.name = g;
    l.value = h;
    this.c[this.c.length] = l;
    return this;
};
mboxUrlBuilder.prototype.addParameters = function (c) {
    if (!c) {
        return this;
    }
    for (var j = 0; j < c.length; j++) {
        var m = c[j].indexOf('=');
        if (m == -1 || m == 0) {
            continue;
        }
        this.addParameter(c[j].substring(0, m), c[j].substring(m + 1, c[j].length));
    }
    return this;
};
mboxUrlBuilder.prototype.setServerType = function (n) {
    this.o = n;
};
mboxUrlBuilder.prototype.setBasePath = function (f) {
    this.f = f;
};
mboxUrlBuilder.prototype.setUrlProcessAction = function (p) {
    this.d = p;
};
mboxUrlBuilder.prototype.buildUrl = function () {
    var q = this.f ? this.f : '/m2/' + this.b + '/mbox/' + this.o;
    var r = document.location.protocol == 'file:' ? 'http:' : document.location.protocol;
    var e = r + "//" + this.a + q;
    var s = e.indexOf('?') != -1 ? '&' : '?';
    for (var j = 0; j < this.c.length; j++) {
        var k = this.c[j];
        if ((k.name == 'lnk') && typeof (k.value) != 'string') {
            continue;
        }
        e += s + encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value);
        s = '&';
    }
    return this.t(this.d(e));
};
mboxUrlBuilder.prototype.getParameters = function () {
    return this.c;
};
mboxUrlBuilder.prototype.setParameters = function (c) {
    this.c = c;
};
mboxUrlBuilder.prototype.clone = function () {
    var u = new mboxUrlBuilder(this.a, this.b);
    u.setServerType(this.o);
    u.setBasePath(this.f);
    u.setUrlProcessAction(this.d);
    for (var j = 0; j < this.c.length; j++) {
        u.addParameter(this.c[j].name, this.c[j].value);
    }
    return u;
};
mboxUrlBuilder.prototype.t = function (v) {
    return v.replace(/\"/g, '&quot;').replace(/>/g, '&gt;');
};
mboxStandardFetcher = function () {};
mboxStandardFetcher.prototype.getType = function () {
    return 'standard';
};
mboxStandardFetcher.prototype.fetch = function (w) {
    w.setServerType(this.getType());
    document.write('<' + 'scr' + 'ipt src="' + w.buildUrl() + '" language="JavaScript"><' + '\/scr' + 'ipt>');
};
mboxStandardFetcher.prototype.cancel = function () {};
mboxAjaxFetcher = function () {};
mboxAjaxFetcher.prototype.getType = function () {
    return 'ajax';
};
mboxAjaxFetcher.prototype.fetch = function (w) {
    w.setServerType(this.getType());
    var e = w.buildUrl();
    this.x = document.createElement('script');
    this.x.src = e;
    document.body.appendChild(this.x);
};
mboxAjaxFetcher.prototype.cancel = function () {};
mboxMap = function () {
    this.y = new Object();
    this.z = new Array();
};
mboxMap.prototype.put = function (A, h) {
    if (!this.y[A]) {
        this.z[this.z.length] = A;
    }
    this.y[A] = h;
};
mboxMap.prototype.get = function (A) {
    return this.y[A];
};
mboxMap.prototype.remove = function (A) {
    this.y[A] = undefined;
};
mboxMap.prototype.each = function (p) {
    for (var j = 0; j < this.z.length; j++) {
        var A = this.z[j];
        var h = this.y[A];
        if (h) {
            var B = p(A, h);
            if (B === false) {
                break;
            }
        }
    }
};
mboxFactory = function (C, b, D) {
    this.E = false;
    this.C = C;
    this.D = D;
    this.F = new mboxList();
    mboxFactories.put(D, this);
    this.G = typeof document.createElement('div').replaceChild != 'undefined' && (function () {
        return true;
    })() && typeof document.getElementById != 'undefined' && typeof (window.attachEvent || document.addEventListener || window.addEventListener) != 'undefined' && typeof encodeURIComponent != 'undefined';
    this.H = this.G && mboxGetPageParameter('mboxDisable') == null;
    var I = D == 'default';
    this.J = new mboxCookieManager('mbox' + (I ? '' : ('-' + D)), (function () {
        return mboxCookiePageDomain();
    })());
    this.H = this.H && this.J.isEnabled() && (this.J.getCookie('disable') == null);
    if (this.isAdmin()) {
        this.enable();
    }
    this.K();
    this.L = mboxGenerateId();
    this.M = mboxScreenHeight();
    this.N = mboxScreenWidth();
    this.O = mboxBrowserWidth();
    this.P = mboxBrowserHeight();
    this.Q = mboxScreenColorDepth();
    this.R = mboxBrowserTimeOffset();
    this.S = new mboxSession(this.L, 'mboxSession', 'session', 31 * 60, this.J);
    this.T = new mboxPC('PC', 1209600, this.J);
    this.w = new mboxUrlBuilder(C, b);
    this.U(this.w, I);
    this.V = new Date().getTime();
    this.W = this.V;
    var X = this;
    this.addOnLoad(function () {
        X.W = new Date().getTime();
    });
    if (this.G) {
        this.addOnLoad(function () {
            X.E = true;
            X.getMboxes().each(function (Y) {
                Y.setFetcher(new mboxAjaxFetcher());
                Y.finalize();
            });
        });
        if (this.H) {
            this.limitTraffic(100, 10368000);
            this.Z();
            this._ = new mboxSignaler(function (ab, c) {
                return X.create(ab, c);
            }, this.J);
        }
    }
};
mboxFactory.prototype.isEnabled = function () {
    return this.H;
};
mboxFactory.prototype.getDisableReason = function () {
    return this.J.getCookie('disable');
};
mboxFactory.prototype.isSupported = function () {
    return this.G;
};
mboxFactory.prototype.disable = function (bb, cb) {
    if (typeof bb == 'undefined') {
        bb = 60 * 60;
    }
    if (typeof cb == 'undefined') {
        cb = 'unspecified';
    }
    if (!this.isAdmin()) {
        this.H = false;
        this.J.setCookie('disable', cb, bb);
    }
};
mboxFactory.prototype.enable = function () {
    this.H = true;
    this.J.deleteCookie('disable');
};
mboxFactory.prototype.isAdmin = function () {
    return document.location.href.indexOf('mboxEnv') != -1;
};
mboxFactory.prototype.limitTraffic = function (db, bb) {};
mboxFactory.prototype.addOnLoad = function (eb) {
    if (this.isDomLoaded()) {
        eb();
    } else {
        var fb = false;
        var gb = function () {
            if (fb) {
                return;
            }
            fb = true;
            eb();
        };
        this.hb.push(gb);
        if (this.isDomLoaded() && !fb) {
            gb();
        }
    }
};
mboxFactory.prototype.getEllapsedTime = function () {
    return this.W - this.V;
};
mboxFactory.prototype.getEllapsedTimeUntil = function (ib) {
    return ib - this.V;
};
mboxFactory.prototype.getMboxes = function () {
    return this.F;
};
mboxFactory.prototype.get = function (ab, jb) {
    return this.F.get(ab).getById(jb || 0);
};
mboxFactory.prototype.update = function (ab, c) {
    if (!this.isEnabled()) {
        return;
    }
    if (!this.isDomLoaded()) {
        var X = this;
        this.addOnLoad(function () {
            X.update(ab, c);
        });
        return;
    }
    if (this.F.get(ab).length() == 0) {
        throw "Mbox " + ab + " is not defined";
    }
    this.F.get(ab).each(function (Y) {
        Y.getUrlBuilder().addParameter('mboxPage', mboxGenerateId());
        Y.load(c);
    });
};
mboxFactory.prototype.create = function (ab, c, kb) {
    if (!this.isSupported()) {
        return null;
    }
    var e = this.w.clone();
    e.addParameter('mboxCount', this.F.length() + 1);
    e.addParameters(c);
    var jb = this.F.get(ab).length();
    var lb = this.D + '-' + ab + '-' + jb;
    var mb;
    if (kb) {
        mb = new mboxLocatorNode(kb);
    } else {
        if (this.E) {
            throw 'The page has already been loaded, can\'t write marker';
        }
        mb = new mboxLocatorDefault(lb);
    }
    try {
        var X = this;
        var nb = 'mboxImported-' + lb;
        var Y = new mbox(ab, jb, e, mb, nb);
        if (this.H) {
            Y.setFetcher(this.E ? new mboxAjaxFetcher() : new mboxStandardFetcher());
        }
        Y.setOnError(function (ob, n) {
            Y.setMessage(ob);
            Y.activate();
            if (!Y.isActivated()) {
                X.disable(60 * 60, ob);
                window.location.reload(false);
            }
        });
        this.F.add(Y);
    } catch (pb) {
        this.disable();
        throw 'Failed creating mbox "' + ab + '", the error was: ' + pb;
    }
    var qb = new Date();
    e.addParameter('mboxTime', qb.getTime() - (qb.getTimezoneOffset() * 60000));
    return Y;
};
mboxFactory.prototype.getCookieManager = function () {
    return this.J;
};
mboxFactory.prototype.getPageId = function () {
    return this.L;
};
mboxFactory.prototype.getPCId = function () {
    return this.T;
};
mboxFactory.prototype.getSessionId = function () {
    return this.S;
};
mboxFactory.prototype.getSignaler = function () {
    return this._;
};
mboxFactory.prototype.getUrlBuilder = function () {
    return this.w;
};
mboxFactory.prototype.U = function (e, I) {
    e.addParameter('mboxHost', document.location.hostname).addParameter('mboxSession', this.S.getId());
    if (!I) {
        e.addParameter('mboxFactoryId', this.D);
    }
    if (this.T.getId() != null) {
        e.addParameter('mboxPC', this.T.getId());
    }
    e.addParameter('mboxPage', this.L);
    e.addParameter('screenHeight', this.M);
    e.addParameter('screenWidth', this.N);
    e.addParameter('browserWidth', this.O);
    e.addParameter('browserHeight', this.P);
    e.addParameter('browserTimeOffset', this.R);
    e.addParameter('colorDepth', this.Q);
    e.addParameters(this.rb().split('&'));
    e.setUrlProcessAction(function (e) {
        e += '&mboxURL=' + encodeURIComponent(document.location);
        var sb = encodeURIComponent(document.referrer);
        if (e.length + sb.length < 2000) {
            e += '&mboxReferrer=' + sb;
        }
        e += '&mboxVersion=' + mboxVersion;
        return e;
    });
};
mboxFactory.prototype.rb = function () {
    function tnt_readcookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return "";
    }

    return tnt_readcookie("custype");
};
mboxFactory.prototype.Z = function () {
    document.write('<style>.' + 'mboxDefault' + ' { visibility:hidden; }</style>');
};
mboxFactory.prototype.isDomLoaded = function () {
    return this.E;
};
mboxFactory.prototype.K = function () {
    if (this.hb != null) {
        return;
    }
    this.hb = new Array();
    var X = this;
    (function () {
        var tb = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";
        var ub = false;
        var vb = function () {
            if (ub) {
                return;
            }
            ub = true;
            for (var i = 0; i < X.hb.length; ++i) {
                X.hb[i]();
            }
        };
        if (document.addEventListener) {
            document.addEventListener(tb, function () {
                document.removeEventListener(tb, arguments.callee, false);
                vb();
            }, false);
            window.addEventListener("load", function () {
                document.removeEventListener("load", arguments.callee, false);
                vb();
            }, false);
        } else if (document.attachEvent) {
            if (self !== self.top) {
                document.attachEvent(tb, function () {
                    if (document.readyState === 'complete') {
                        document.detachEvent(tb, arguments.callee);
                        vb();
                    }
                });
            } else {
                var wb = function () {
                    try {
                        document.documentElement.doScroll('left');
                        vb();
                    } catch (xb) {
                        setTimeout(wb, 13);
                    }
                };
                wb();
            }
        }
        if (document.readyState === "complete") {
            vb();
        }
    })();
};
mboxSignaler = function (yb, J) {
    this.J = J;
    var zb = J.getCookieNames('signal-');
    for (var j = 0; j < zb.length; j++) {
        var Ab = zb[j];
        var Bb = J.getCookie(Ab).split('&');
        var Y = yb(Bb[0], Bb);
        Y.load();
        J.deleteCookie(Ab);
    }
};
mboxSignaler.prototype.signal = function (Cb, ab) {
    this.J.setCookie('signal-' + Cb, mboxShiftArray(arguments).join('&'), 45 * 60);
};
mboxList = function () {
    this.F = new Array();
};
mboxList.prototype.add = function (Y) {
    if (Y != null) {
        this.F[this.F.length] = Y;
    }
};
mboxList.prototype.get = function (ab) {
    var B = new mboxList();
    for (var j = 0; j < this.F.length; j++) {
        var Y = this.F[j];
        if (Y.getName() == ab) {
            B.add(Y);
        }
    }
    return B;
};
mboxList.prototype.getById = function (Db) {
    return this.F[Db];
};
mboxList.prototype.length = function () {
    return this.F.length;
};
mboxList.prototype.each = function (p) {
    if (typeof p != 'function') {
        throw 'Action must be a function, was: ' + typeof (p);
    }
    for (var j = 0; j < this.F.length; j++) {
        p(this.F[j]);
    }
};
mboxLocatorDefault = function (g) {
    this.g = 'mboxMarker-' + g;
    document.write('<div id="' + this.g + '" style="visibility:hidden;display:none">&nbsp;</div>');
};
mboxLocatorDefault.prototype.locate = function () {
    var Eb = document.getElementById(this.g);
    while (Eb != null) {
        if (Eb.nodeType == 1) {
            if (Eb.className == 'mboxDefault') {
                return Eb;
            }
        }
        Eb = Eb.previousSibling;
    }
    return null;
};
mboxLocatorDefault.prototype.force = function () {
    var Fb = document.createElement('div');
    Fb.className = 'mboxDefault';
    var Gb = document.getElementById(this.g);
    Gb.parentNode.insertBefore(Fb, Gb);
    return Fb;
};
mboxLocatorNode = function (Hb) {
    this.Eb = Hb;
};
mboxLocatorNode.prototype.locate = function () {
    return typeof this.Eb == 'string' ? document.getElementById(this.Eb) : this.Eb;
};
mboxLocatorNode.prototype.force = function () {
    return null;
};
mboxCreate = function (ab) {
    var Y = mboxFactoryDefault.create(ab, mboxShiftArray(arguments));
    if (Y) {
        Y.load();
    }
    return Y;
};
mboxDefine = function (kb, ab) {
    var Y = mboxFactoryDefault.create(ab, mboxShiftArray(mboxShiftArray(arguments)), kb);
    return Y;
};
mboxUpdate = function (ab) {
    mboxFactoryDefault.update(ab, mboxShiftArray(arguments));
};
mbox = function (g, Ib, w, Jb, nb) {
    this.Kb = null;
    this.Lb = 0;
    this.mb = Jb;
    this.nb = nb;
    this.Mb = null;
    this.Nb = new mboxOfferContent();
    this.Fb = null;
    this.w = w;
    this.message = '';
    this.Ob = new Object();
    this.Pb = 0;
    this.Ib = Ib;
    this.g = g;
    this.Qb();
    w.addParameter('mbox', g).addParameter('mboxId', Ib);
    this.Rb = function () {};
    this.Sb = function () {};
    this.Tb = null;
};
mbox.prototype.getId = function () {
    return this.Ib;
};
mbox.prototype.Qb = function () {
    if (this.g.length > 250) {
        throw "Mbox Name " + this.g + " exceeds max length of " + "250 characters.";
    } else if (this.g.match(/^\s+|\s+$/g)) {
        throw "Mbox Name " + this.g + " has leading/trailing whitespace(s).";
    }
};
mbox.prototype.getName = function () {
    return this.g;
};
mbox.prototype.getParameters = function () {
    var c = this.w.getParameters();
    var B = new Array();
    for (var j = 0; j < c.length; j++) {
        if (c[j].name.indexOf('mbox') != 0) {
            B[B.length] = c[j].name + '=' + c[j].value;
        }
    }
    return B;
};
mbox.prototype.setOnLoad = function (p) {
    this.Sb = p;
    return this;
};
mbox.prototype.setMessage = function (ob) {
    this.message = ob;
    return this;
};
mbox.prototype.setOnError = function (Rb) {
    this.Rb = Rb;
    return this;
};
mbox.prototype.setFetcher = function (Ub) {
    if (this.Mb) {
        this.Mb.cancel();
    }
    this.Mb = Ub;
    return this;
};
mbox.prototype.getFetcher = function () {
    return this.Mb;
};
mbox.prototype.load = function (c) {
    if (this.Mb == null) {
        return this;
    }
    this.setEventTime("load.start");
    this.cancelTimeout();
    this.Lb = 0;
    var w = (c && c.length > 0) ? this.w.clone().addParameters(c) : this.w;
    this.Mb.fetch(w);
    var X = this;
    this.Vb = setTimeout(function () {
        X.Rb('browser timeout', X.Mb.getType());
    }, 15000);
    this.setEventTime("load.end");
    return this;
};
mbox.prototype.loaded = function () {
    this.cancelTimeout();
    if (!this.activate()) {
        var X = this;
        setTimeout(function () {
            X.loaded();
        }, 100);
    }
};
mbox.prototype.activate = function () {
    if (this.Lb) {
        return this.Lb;
    }
    this.setEventTime('activate' + ++this.Pb + '.start');
    if (this.show()) {
        this.cancelTimeout();
        this.Lb = 1;
    }
    this.setEventTime('activate' + this.Pb + '.end');
    return this.Lb;
};
mbox.prototype.isActivated = function () {
    return this.Lb;
};
mbox.prototype.setOffer = function (Nb) {
    if (Nb && Nb.show && Nb.setOnLoad) {
        this.Nb = Nb;
    } else {
        throw 'Invalid offer';
    }
    return this;
};
mbox.prototype.getOffer = function () {
    return this.Nb;
};
mbox.prototype.show = function () {
    this.setEventTime('show.start');
    var B = this.Nb.show(this);
    this.setEventTime(B == 1 ? "show.end.ok" : "show.end");
    return B;
};
mbox.prototype.showContent = function (Wb) {
    if (Wb == null) {
        return 0;
    }
    if (this.Fb == null || !this.Fb.parentNode) {
        this.Fb = this.getDefaultDiv();
        if (this.Fb == null) {
            return 0;
        }
    }
    if (this.Fb != Wb) {
        this.Xb(this.Fb);
        this.Fb.parentNode.replaceChild(Wb, this.Fb);
        this.Fb = Wb;
    }
    this.Yb(Wb);
    this.Sb();
    return 1;
};
mbox.prototype.hide = function () {
    this.setEventTime('hide.start');
    var B = this.showContent(this.getDefaultDiv());
    this.setEventTime(B == 1 ? 'hide.end.ok' : 'hide.end.fail');
    return B;
};
mbox.prototype.finalize = function () {
    this.setEventTime('finalize.start');
    this.cancelTimeout();
    if (this.getDefaultDiv() == null) {
        if (this.mb.force() != null) {
            this.setMessage('No default content, an empty one has been added');
        } else {
            this.setMessage('Unable to locate mbox');
        }
    }
    if (!this.activate()) {
        this.hide();
        this.setEventTime('finalize.end.hide');
    }
    this.setEventTime('finalize.end.ok');
};
mbox.prototype.cancelTimeout = function () {
    if (this.Vb) {
        clearTimeout(this.Vb);
    }
    if (this.Mb != null) {
        this.Mb.cancel();
    }
};
mbox.prototype.getDiv = function () {
    return this.Fb;
};
mbox.prototype.getDefaultDiv = function () {
    if (this.Tb == null) {
        this.Tb = this.mb.locate();
    }
    return this.Tb;
};
mbox.prototype.setEventTime = function (Zb) {
    this.Ob[Zb] = (new Date()).getTime();
};
mbox.prototype.getEventTimes = function () {
    return this.Ob;
};
mbox.prototype.getImportName = function () {
    return this.nb;
};
mbox.prototype.getURL = function () {
    return this.w.buildUrl();
};
mbox.prototype.getUrlBuilder = function () {
    return this.w;
};
mbox.prototype._b = function (Fb) {
    return Fb.style.display != 'none';
};
mbox.prototype.Yb = function (Fb) {
    this.ac(Fb, true);
};
mbox.prototype.Xb = function (Fb) {
    this.ac(Fb, false);
};
mbox.prototype.ac = function (Fb, bc) {
    Fb.style.visibility = bc ? "visible" : "hidden";
    Fb.style.display = bc ? "block" : "none";
};
mboxOfferContent = function () {
    this.Sb = function () {};
};
mboxOfferContent.prototype.show = function (Y) {
    var B = Y.showContent(document.getElementById(Y.getImportName()));
    if (B == 1) {
        this.Sb();
    }
    return B;
};
mboxOfferContent.prototype.setOnLoad = function (Sb) {
    this.Sb = Sb;
};
mboxOfferAjax = function (Wb) {
    this.Wb = Wb;
    this.Sb = function () {};
};
mboxOfferAjax.prototype.setOnLoad = function (Sb) {
    this.Sb = Sb;
};
mboxOfferAjax.prototype.show = function (Y) {
    var cc = document.createElement('div');
    cc.id = Y.getImportName();
    cc.innerHTML = this.Wb;
    var B = Y.showContent(cc);
    if (B == 1) {
        this.Sb();
    }
    return B;
};
mboxOfferDefault = function () {
    this.Sb = function () {};
};
mboxOfferDefault.prototype.setOnLoad = function (Sb) {
    this.Sb = Sb;
};
mboxOfferDefault.prototype.show = function (Y) {
    var B = Y.hide();
    if (B == 1) {
        this.Sb();
    }
    return B;
};
mboxCookieManager = function mboxCookieManager(g, dc) {
    this.g = g;
    this.dc = dc == '' || dc.indexOf('.') == -1 ? '' : '; domain=' + dc;
    this.ec = new mboxMap();
    this.loadCookies();
};
mboxCookieManager.prototype.isEnabled = function () {
    this.setCookie('check', 'true', 60);
    this.loadCookies();
    return this.getCookie('check') == 'true';
};
mboxCookieManager.prototype.setCookie = function (g, h, bb) {
    if (typeof g != 'undefined' && typeof h != 'undefined' && typeof bb != 'undefined') {
        var fc = new Object();
        fc.name = g;
        fc.value = escape(h);
        fc.expireOn = Math.ceil(bb + new Date().getTime() / 1000);
        this.ec.put(g, fc);
        this.saveCookies();
    }
};
mboxCookieManager.prototype.getCookie = function (g) {
    var fc = this.ec.get(g);
    return fc ? unescape(fc.value) : null;
};
mboxCookieManager.prototype.deleteCookie = function (g) {
    this.ec.remove(g);
    this.saveCookies();
};
mboxCookieManager.prototype.getCookieNames = function (gc) {
    var hc = new Array();
    this.ec.each(function (g, fc) {
        if (g.indexOf(gc) == 0) {
            hc[hc.length] = g;
        }
    });
    return hc;
};
mboxCookieManager.prototype.saveCookies = function () {
    var ic = false;
    var jc = 'disable';
    var kc = new Array();
    var lc = 0;
    this.ec.each(function (g, fc) {
        if (!ic || g === jc) {
            kc[kc.length] = g + '#' + fc.value + '#' + fc.expireOn;
            if (lc < fc.expireOn) {
                lc = fc.expireOn;
            }
        }
    });
    var mc = new Date(lc * 1000);
    document.cookie = this.g + '=' + kc.join('|') + '; expires=' + mc.toGMTString() + '; path=/' + this.dc;
};
mboxCookieManager.prototype.loadCookies = function () {
    this.ec = new mboxMap();
    var nc = document.cookie.indexOf(this.g + '=');
    if (nc != -1) {
        var oc = document.cookie.indexOf(';', nc);
        if (oc == -1) {
            oc = document.cookie.indexOf(',', nc);
            if (oc == -1) {
                oc = document.cookie.length;
            }
        }
        var pc = document.cookie.substring(nc + this.g.length + 1, oc).split('|');
        var qc = Math.ceil(new Date().getTime() / 1000);
        for (var j = 0; j < pc.length; j++) {
            var fc = pc[j].split('#');
            if (qc <= fc[2]) {
                var rc = new Object();
                rc.name = fc[0];
                rc.value = fc[1];
                rc.expireOn = fc[2];
                this.ec.put(rc.name, rc);
            }
        }
    }
};
mboxSession = function (sc, tc, Ab, uc, J) {
    this.tc = tc;
    this.Ab = Ab;
    this.uc = uc;
    this.J = J;
    this.vc = false;
    this.Ib = typeof mboxForceSessionId != 'undefined' ? mboxForceSessionId : mboxGetPageParameter(this.tc);
    if (this.Ib == null || this.Ib.length == 0) {
        this.Ib = J.getCookie(Ab);
        if (this.Ib == null || this.Ib.length == 0) {
            this.Ib = sc;
            this.vc = true;
        }
    }
    J.setCookie(Ab, this.Ib, uc);
};
mboxSession.prototype.getId = function () {
    return this.Ib;
};
mboxSession.prototype.forceId = function (wc) {
    this.Ib = wc;
    this.J.setCookie(this.Ab, this.Ib, this.uc);
};
mboxPC = function (Ab, uc, J) {
    this.Ab = Ab;
    this.uc = uc;
    this.J = J;
    this.Ib = typeof mboxForcePCId != 'undefined' ? mboxForcePCId : J.getCookie(Ab);
    if (this.Ib != null) {
        J.setCookie(Ab, this.Ib, uc);
    }
};
mboxPC.prototype.getId = function () {
    return this.Ib;
};
mboxPC.prototype.forceId = function (wc) {
    if (this.Ib != wc) {
        this.Ib = wc;
        this.J.setCookie(this.Ab, this.Ib, this.uc);
        return true;
    }
    return false;
};
mboxGetPageParameter = function (g) {
    var B = null;
    var xc = new RegExp(g + "=([^\&]*)");
    var yc = xc.exec(document.location);
    if (yc != null && yc.length >= 2) {
        B = yc[1];
    }
    return B;
};
mboxSetCookie = function (g, h, bb) {
    return mboxFactoryDefault.getCookieManager().setCookie(g, h, bb);
};
mboxGetCookie = function (g) {
    return mboxFactoryDefault.getCookieManager().getCookie(g);
};
mboxCookiePageDomain = function () {
    var dc = (/([^:]*)(:[0-9]{0,5})?/).exec(document.location.host)[1];
    var zc = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
    if (!zc.exec(dc)) {
        var Ac = (/([^\.]+\.[^\.]{3}|[^\.]+\.[^\.]+\.[^\.]{2})$/).exec(dc);
        if (Ac) {
            dc = Ac[0];
        }
    }
    return dc ? dc : "";
};
mboxShiftArray = function (Bc) {
    var B = new Array();
    for (var j = 1; j < Bc.length; j++) {
        B[B.length] = Bc[j];
    }
    return B;
};
mboxGenerateId = function () {
    return (new Date()).getTime() + "-" + Math.floor(Math.random() * 999999);
};
mboxScreenHeight = function () {
    return screen.height;
};
mboxScreenWidth = function () {
    return screen.width;
};
mboxBrowserWidth = function () {
    return (window.innerWidth) ? window.innerWidth : document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
};
mboxBrowserHeight = function () {
    return (window.innerHeight) ? window.innerHeight : document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
};
mboxBrowserTimeOffset = function () {
    return -new Date().getTimezoneOffset();
};
mboxScreenColorDepth = function () {
    return screen.pixelDepth;
};
if (typeof mboxVersion == 'undefined') {
    var mboxVersion = 41;
    var mboxFactories = new mboxMap();
    var mboxFactoryDefault = new mboxFactory('britishskybroadcasti.tt.omtrdc.net', 'britishskybroadcasti', 'default');
};
if (mboxGetPageParameter("mboxDebug") != null || mboxFactoryDefault.getCookieManager().getCookie("debug") != null) {
    setTimeout(function () {
        if (typeof mboxDebugLoaded == 'undefined') {
            alert('Could not load the remote debug.\nPlease check your connection' + ' to Test&amp;Target servers');
        }
    }, 60 * 60);
    document.write('<' + 'scr' + 'ipt language="Javascript1.2" src=' + '"http://admin5.testandtarget.omniture.com/admin/mbox/mbox_debug.jsp?mboxServerHost=britishskybroadcasti.tt.omtrdc.net' + '&clientCode=britishskybroadcasti"><' + '\/scr' + 'ipt>');
};
mboxScPluginFetcher = function (b, Cc) {
    this.b = b;
    this.Cc = Cc;
};
mboxScPluginFetcher.prototype.Dc = function (w) {
    w.setBasePath('/m2/' + this.b + '/sc/standard');
    this.Ec(w);
    var e = w.buildUrl();
    e += '&scPluginVersion=1';
    return e;
};
mboxScPluginFetcher.prototype.Ec = function (w) {
    var Fc = ["dynamicVariablePrefix", "visitorID", "vmk", "ppu", "charSet", "visitorNamespace", "cookieDomainPeriods", "cookieLifetime", "pageName", "currencyCode", "variableProvider", "channel", "server", "pageType", "transactionID", "purchaseID", "campaign", "state", "zip", "events", "products", "linkName", "linkType", "resolution", "colorDepth", "javascriptVersion", "javaEnabled", "cookiesEnabled", "browserWidth", "browserHeight", "connectionType", "homepage", "pe", "pev1", "pev2", "pev3", "visitorSampling", "visitorSamplingGroup", "dynamicAccountSelection", "dynamicAccountList", "dynamicAccountMatch", "trackDownloadLinks", "trackExternalLinks", "trackInlineStats", "linkLeaveQueryString", "linkDownloadFileTypes", "linkExternalFilters", "linkInternalFilters", "linkTrackVars", "linkTrackEvents", "linkNames", "lnk", "eo"];
    for (var j = 0; j < Fc.length; j++) {
        this.Gc(Fc[j], w);
    }
    for (var j = 1; j <= 75; j++) {
        this.Gc('prop' + j, w);
        this.Gc('eVar' + j, w);
        this.Gc('hier' + j, w);
    }
};
mboxScPluginFetcher.prototype.Gc = function (g, w) {
    var h = this.Cc[g];
    if (typeof (h) === 'undefined' || h === null || h === '') {
        return;
    }
    w.addParameter(g, h);
};
mboxScPluginFetcher.prototype.cancel = function () {};
mboxScPluginFetcher.prototype.fetch = function (w) {
    w.setServerType(this.getType());
    var e = this.Dc(w);
    this.x = document.createElement('script');
    this.x.src = e;
    document.body.appendChild(this.x);
};
mboxScPluginFetcher.prototype.getType = function () {
    return 'ajax';
};

function mboxLoadSCPlugin(Cc) {
    if (!Cc) {
        return null;
    }
    Cc.m_tt = function (Cc) {
        var Hc = Cc.m_i('tt');
        Hc.H = true;
        Hc.b = 'britishskybroadcasti';
        Hc['_t'] = function () {
            if (!this.isEnabled()) {
                return;
            }
            var Y = this.Jc();
            if (Y) {
                var Ub = new mboxScPluginFetcher(this.b, this.s);
                Y.setFetcher(Ub);
                Y.load();
            }
        };
        Hc.isEnabled = function () {
            return this.H && mboxFactoryDefault.isEnabled();
        };
        Hc.Jc = function () {
            var ab = this.Kc();
            var Fb = document.createElement('DIV');
            return mboxFactoryDefault.create(ab, new Array(), Fb);
        };
        Hc.Kc = function () {
            var Lc = this.s.events && this.s.events.indexOf('purchase') != -1;
            return 'SiteCatalyst: ' + (Lc ? 'purchase' : 'event');
        };
    };
    return Cc.loadModule('tt');
};
var mboxTrack = function (mbox, params) {
    var m, u, i, f = mboxFactoryDefault;
    if (f.isEnabled()) {
        if (f.getMboxes().length() > 0) {
            m = f.getMboxes().getById(0);
            u = m.getURL().replace("mbox=" + escape(m.getName()), "mbox=" + mbox).replace("/undefined", "/ajax").replace("mboxPage=" + f.getPageId(), "mboxPage=" + mboxGenerateId()) + '&' + params, i = new Image();
            i.style.display = 'none';
            i.src = u;
            document.body.appendChild(i)
        } else {
            mboxTrackDefer(mbox, params)
        }
    }
}, mboxTrackDefer = function (mbox, params) {
    var f = mboxFactoryDefault;
    if (f.isEnabled()) {
        mboxFactoryDefault.getSignaler().signal(mbox, mbox + '&' + params)
    }
}, mboxTrackLink = function (mbox, params, url) {
    mboxTrack(mbox, params);
    setTimeout("location='" + url + "'", 500)
};