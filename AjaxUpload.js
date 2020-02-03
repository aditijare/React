/*
 * jQuery AjaxUpload.3.5
 */
(function () {
    var h = document,
            l = window,
            inputElement = '',
            inputData = '';

    function b(d) {
        if (typeof d == "string") {
            d = h.getElementById(d)
        }
        return d
    }

    function e(q, p, d) {
        if (l.addEventListener) {
            q.addEventListener(p, d, false)
        } else {
            if (l.attachEvent) {
                var r = function () {
                    d.call(q, l.event)
                };
                q.attachEvent("on" + p, r)
            }
        }
    }
    var c = function () {
        var d = h.createElement("div");
        return function (p) {
            d.innerHTML = p;
            var q = d.childNodes[0];
            d.removeChild(q);
            return q
        }
    }();

    function f(p, d) {
        return p.className.match(new RegExp("(\\s|^)" + d + "(\\s|$)"))
    }

    function g(p, d) {
        if (!f(p, d)) {
            p.className += " " + d
        }
    }

    function m(q, d) {
        var p = new RegExp("(\\s|^)" + d + "(\\s|$)");
        q.className = q.className.replace(p, " ")
    }
    if (document.documentElement.getBoundingClientRect) {
        var n = function (d) {
            var t = d.getBoundingClientRect(),
                    x = d.ownerDocument,
                    u = x.body,
                    p = x.documentElement,
                    s = p.clientTop || u.clientTop || 0,
                    v = p.clientLeft || u.clientLeft || 0,
                    y = 1;
            if (u.getBoundingClientRect) {
                var r = u.getBoundingClientRect();
                y = (r.right - r.left) / u.clientWidth
            }
            if (y > 1) {
                s = 0;
                v = 0
            }
            var w = t.top / y + (window.pageYOffset || p && p.scrollTop / y || u.scrollTop / y) - s,
                    q = t.left / y + (window.pageXOffset || p && p.scrollLeft / y || u.scrollLeft / y) - v;
            return {
                top: w,
                left: q
            }
        }
    } else {
        var n = function (d) {
            if (l.jQuery) {
                return jQuery(d).offset()
            }
            var q = 0,
                    p = 0;
            do {
                q += d.offsetTop || 0;
                p += d.offsetLeft || 0
            } while (d = d.offsetParent);
            return {
                left: p,
                top: q
            }
        }
    }

    function a(q) {
        var s, p, r, d;
        var t = n(q);
        s = t.left;
        r = t.top;
        p = s + q.offsetWidth;
        d = r + q.offsetHeight;
        return {
            left: s,
            right: p,
            top: r,
            bottom: d
        }
    }

    function j(r) {
        if (!r.pageX && r.clientX) {
            var q = 1;
            var d = document.body;
            if (d.getBoundingClientRect) {
                var p = d.getBoundingClientRect();
                q = (p.right - p.left) / d.clientWidth
            }
            return {
                x: r.clientX / q + h.body.scrollLeft + h.documentElement.scrollLeft,
                y: r.clientY / q + h.body.scrollTop + h.documentElement.scrollTop
            }
        }
        return {
            x: r.pageX,
            y: r.pageY
        }
    }
    var i = function () {
        var d = 0;
        return function () {
            return "ValumsAjaxUpload" + d++
        }
    }();

    function o(d) {
        return d.replace(/.*(\/|\\)/, "")
    }

    function k(d) {
        return (/[.]/.exec(d)) ? /[^.]+$/.exec(d.toLowerCase()) : ""
    }
    Ajax_upload = AjaxUpload = function (q, d) {
        this._inputElement = q;
        this._inputData = d;
		if (q.jquery) {
            q = q[0]
        } else {
            if (typeof q == "string" && /^#.*/.test(q)) {
                q = q.slice(1)
            }
        }
        q = b(q);
        this._input = null;
        this._button = q;
        this._disabled = false;
        this._submitting = false;
        this._justClicked = false;
        this._parentDialog = h.body;
        if (window.jQuery && jQuery.ui && jQuery.ui.dialog) {
            var r = jQuery(this._button).parents(".ui-dialog");
            if (r.length) {
                this._parentDialog = r[0]
            }
        }
        this._settings = {
            action: "upload.php",
            name: "userfile",
            data: {},
            autoSubmit: true,
            responseType: false,
            onChange: function (s, t) {},
            onSubmit: function (s, t) {},
            onComplete: function (t, s) {}
        };
        for (var p in d) {
            this._settings[p] = d[p]
        }
        this._createInput();
        this._rerouteClicks()
    };
    AjaxUpload.prototype = {
		setData: function (d) {
            this._settings.data = d
        },
        disable: function () {
            this._disabled = true
        },
        enable: function () {
            this._disabled = false
        },
        destroy: function () {
            if (this._input) {
                if (this._input.parentNode) {
                    this._input.parentNode.removeChild(this._input)
                }
                this._input = null
            }
        },
        _createInput: function () {
            var p = this;
            var d = h.createElement("input");
            d.setAttribute("type", "file");
            d.setAttribute("id", "hiddenajaxfile");
            d.setAttribute("name", this._settings.name);
            var r = {
                position: "absolute",
                margin: "-5px 0 0 -175px",
                padding: 0,
                width: "220px",
                height: "30px",
                fontSize: "14px",
                opacity: 0,
                cursor: "pointer",
                display: "none",
                zIndex: 5000
            };
            for (var q in r) {
                d.style[q] = r[q]
            }
            if (!(d.style.opacity === "0")) {
                d.style.filter = "alpha(opacity=0)"
            }
            this._parentDialog.appendChild(d);
            e(d, "change", function () {
                var s = o(this.value);
                if (p._settings.onChange.call(p, s, k(s)) == false) {
                    return
                }
                if (p._settings.autoSubmit) {
                    var myFormData = new FormData();
					myFormData.append( p._inputData.name, $(d)[0].files[0]);
					if(typeof p._inputData.data !=='undefined'){
						$.each(p._inputData.data,function(key,input){
							myFormData.append(key,input);
						});
					}
					this._inputElement = myFormData;
					p.submit(this._inputElement)
                }
            });
            e(d, "click", function () {
                p.justClicked = true;
                setTimeout(function () {
                    p.justClicked = false
                }, 3000)
            });
            this._input = d
        },
        _rerouteClicks: function () {
            var p = this;
            var q, d = {
                top: 0,
                left: 0
            },
                    r = false;
            e(p._button, "mouseover", function (s) {
                if (!p._input || r) {
                    return
                }
                r = true;
                q = a(p._button);
                if (p._parentDialog != h.body) {
                    d = n(p._parentDialog)
                }
            });
            e(document, "mousemove", function (t) {
                var s = p._input;
                if (!s || !r) {
                    return
                }
                if (p._disabled) {
                    m(p._button, "hover");
                    s.style.display = "none";
                    return
                }
                var u = j(t);
                if ((u.x >= q.left) && (u.x <= q.right) && (u.y >= q.top) && (u.y <= q.bottom)) {
                    s.style.top = u.y - d.top + "px";
                    s.style.left = u.x - d.left + "px";
                    s.style.display = "block";
                    g(p._button, "hover")
                } else {
                    r = false;
                    if (!p.justClicked) {
                        s.style.display = "none"
                    }
                    m(p._button, "hover")
                }
            })
        },
        _createIframe: function () {
            var p = i();
            var d = c('<iframe src="javascript:false;" name="' + p + '" />');
            d.id = p;
            d.style.display = "none";
            h.body.appendChild(d);
            return d
        },
        submit: function (formData) {
            var d = this,
                    r = this._settings;
            if (this._input.value === "") {
                return
            }
            var p = o(this._input.value);
            if (!(r.onSubmit.call(this, p, k(p)) == false)) {
                var q = this._createIframe();
                var t = this._createForm(q);
                t.appendChild(this._input);
                console.log("AJAX UPLOAD");
//                t.submit();
                jQuery.ajax({
                    type:  this._inputData.type||'POST',
                    url:  this._inputData.action,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                       r.onComplete.call(d, p, response);
                    },
                    error: function (error) {
                        return;
                    }
                })
                h.body.removeChild(t);
                t = null;
                this._input = null;
                this._createInput();
                var s = false;
                e(q, "load", function (w) {
                    if (q.src == "javascript:'%3Chtml%3E%3C/html%3E';" || q.src == "javascript:'<html></html>';") {
                        if (s) {
                            setTimeout(function () {
                                h.body.removeChild(q)
                            }, 0)
                        }
                        return
                    }
                    var v = q.contentDocument ? q.contentDocument : frames[q.id].document;
                    if (v.readyState && v.readyState != "complete") {
                        return
                    }
                    if (v.body && v.body.innerHTML == "false") {
                        return
                    }
                    var u;
                    if (v.XMLDocument) {
                        u = v.XMLDocument
                    } else {
                        if (v.body) {
                            u = v.body.innerHTML;
                            if (r.responseType && r.responseType.toLowerCase() == "json") {
                                if (v.body.firstChild && v.body.firstChild.nodeName.toUpperCase() == "PRE") {
                                    u = v.body.firstChild.firstChild.nodeValue
                                }
                                if (u) {
                                    u = window["eval"]("(" + u + ")")
                                } else {
                                    u = {}
                                }
                            }
                        } else {
                            var u = v
                        }
                    }
//                    r.onComplete.call(d, p, u);
                    s = true;
                    q.src = "javascript:'<html></html>';"
                })
            } else {
                h.body.removeChild(this._input);
                this._input = null;
                this._createInput()
            }
        },
        _createForm: function (q) {
            var p = this._settings;
            var r = c('<form method="post" enctype="multipart/form-data"></form>');
            r.style.display = "none";
            r.action = p.action;
            r.target = q.name;
            h.body.appendChild(r);
            for (var s in p.data) {
                var d = h.createElement("input");
                d.type = "hidden";
                d.name = s;
                d.value = p.data[s];
                r.appendChild(d)
            }
            return r
        }
    }
})();
