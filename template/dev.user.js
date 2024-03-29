/* eslint-disable no-console */
// eslint-disable-next-line
!function () { "use strict"; function t(t) { if ("string" != typeof t && (t = "" + t), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t)) throw new TypeError("Invalid character in header field name"); return t.toLowerCase() } function e(t) { return "string" != typeof t && (t = "" + t), t } function r(t) { this.map = {}, t instanceof r ? t.forEach(function (t, e) { this.append(e, t) }, this) : t && Object.getOwnPropertyNames(t).forEach(function (e) { this.append(e, t[e]) }, this) } function o(t) { return t.bodyUsed ? p.reject(new TypeError("Already read")) : void (t.bodyUsed = !0) } function n(t) { return new p(function (e, r) { t.onload = function () { e(t.result) }, t.onerror = function () { r(t.error) } }) } function i(t) { var e = new FileReader; return e.readAsArrayBuffer(t), n(e) } function s(t) { var e = new FileReader; return e.readAsText(t), n(e) } function a() { return this.bodyUsed = !1, this._initBody = function (t) { if (this._bodyInit = t, "string" == typeof t) this._bodyText = t; else if (c.blob && Blob.prototype.isPrototypeOf(t)) this._bodyBlob = t; else if (c.formData && FormData.prototype.isPrototypeOf(t)) this._bodyFormData = t; else { if (t) throw Error("unsupported BodyInit type"); this._bodyText = "" } }, c.blob ? (this.blob = function () { var t = o(this); if (t) return t; if (this._bodyBlob) return p.resolve(this._bodyBlob); if (this._bodyFormData) throw Error("could not read FormData body as blob"); return p.resolve(new Blob([this._bodyText])) }, this.arrayBuffer = function () { return this.blob().then(i) }, this.text = function () { var t = o(this); if (t) return t; if (this._bodyBlob) return s(this._bodyBlob); if (this._bodyFormData) throw Error("could not read FormData body as text"); return p.resolve(this._bodyText) }) : this.text = function () { var t = o(this); return t ? t : p.resolve(this._bodyText) }, c.formData && (this.formData = function () { return this.text().then(f) }), this.json = function () { return this.text().then(JSON.parse) }, this } function u(t) { var e = t.toUpperCase(); return y.indexOf(e) > -1 ? e : t } function h(t, e) { if (e = e || {}, this.url = t, this.credentials = e.credentials || "omit", this.headers = new r(e.headers), this.method = u(e.method || "GET"), this.mode = e.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && e.body) throw new TypeError("Body not allowed for GET or HEAD requests"); this._initBody(e.body) } function f(t) { var e = new FormData; return t.trim().split("&").forEach(function (t) { if (t) { var r = t.split("="), o = r.shift().replace(/\+/g, " "), n = r.join("=").replace(/\+/g, " "); e.append(decodeURIComponent(o), decodeURIComponent(n)) } }), e } function d(t) { var e = new r, o = t.trim().split("\n"); return o.forEach(function (t) { var r = t.trim().split(":"), o = r.shift().trim(), n = r.join(":").trim(); e.append(o, n) }), e } function l(t, e) { e || (e = {}), this._initBody(t), this.type = "default", this.url = null, this.status = e.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = e.statusText, this.headers = e.headers instanceof r ? e.headers : new r(e.headers), this.url = e.url || "" } var p = window.Bluebird || window.Promise; if (!self.GM_fetch) { r.prototype.append = function (r, o) { r = t(r), o = e(o); var n = this.map[r]; n || (n = [], this.map[r] = n), n.push(o) }, r.prototype["delete"] = function (e) { delete this.map[t(e)] }, r.prototype.get = function (e) { var r = this.map[t(e)]; return r ? r[0] : null }, r.prototype.getAll = function (e) { return this.map[t(e)] || [] }, r.prototype.has = function (e) { return this.map.hasOwnProperty(t(e)) }, r.prototype.set = function (r, o) { this.map[t(r)] = [e(o)] }, r.prototype.forEach = function (t, e) { Object.getOwnPropertyNames(this.map).forEach(function (r) { this.map[r].forEach(function (o) { t.call(e, o, r, this) }, this) }, this) }; var c = { blob: "FileReader" in self && "Blob" in self && function () { try { return new Blob, !0 } catch (t) { return !1 } }(), formData: "FormData" in self }, y = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"]; a.call(h.prototype), a.call(l.prototype), self.Headers = r, self.Request = h, self.Response = l, self.GM_fetch = function (t, e) { var r; return r = h.prototype.isPrototypeOf(t) && !e ? t : new h(t, e), new p(function (t, e) { function o(t, e, r) { return t ? t : /^X-Request-URL:/m.test(e) ? r.get("X-Request-URL") : void 0 } var n, i = {}; i.method = r.method, i.url = r.url, i.synchronous = !1, i.onload = function (r) { var i = r.status; if (100 > i || i > 599) return void e(new TypeError("Network request failed")); var s = r.responseHeaders; n = d(s); var a = { status: i, statusText: r.statusText, headers: n, url: o(r.finalUrl, s, n) }, u = r.responseText; t(new l(u, a)) }, i.onerror = function () { e(new TypeError("Network request failed")) }, i.headers = {}, r.headers.forEach(function (t, e) { i.headers[e] = t }), void 0 !== r._bodyInit && (i.data = r._bodyInit), GM_xmlhttpRequest(i) }) }, self.GM_fetch.polyfill = !0 } }();
/*  globals GM_fetch  */

(async function () {
	const url = `http://localhost:%PORT%/%NAME%%VERSION%.user.js?${Date.now()}`;
	const r = await GM_fetch(url).catch(reject);
	if (!r || r.status !== 200) {
		reject(r);
	} else {
		const s = await r.text();
		if (s) {
			// eslint-disable-next-line no-eval
			eval(`${s}//# sourceURL=${url}`);
			GM_setValue('scriptlastsource3948218', s);
		}
	}

	function reject(e) {
		if (e && 'status' in e) {
			if (e.status <= 0) {
				log('Server is not responding');
				const src = GM_getValue('scriptlastsource3948218', false);
				if (!src) return;
				log('%cExecuting cached script version', 'color: Crimson; font-size:x-large;');

				// eslint-disable-next-line no-eval
				eval(src);
			} else {
				log(`HTTP status: ${e.status}`);
			}
		} else {
			log(e);
		}

		function log(obj, b) {
			let prefix = 'loadBundleFromServer: ';
			try {
				prefix = `${GM.info.script.name}: `;
				if (b) console.log(prefix + obj, b);
				else console.log(prefix, obj);
			} catch (ex) {
				console.error(ex);
			}
		}
	}
}());