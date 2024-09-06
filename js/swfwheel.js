/**
 * SWFWheel - remove dependencies of mouse wheel on each browser.
 *
 * Copyright (c) 2008 - 2010 Spark project (www.libspark.org)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
(function ()
{
    // do nothing if already defined `SWFWheel`.
    if (window.SWFWheel) return;

    var win = window,
        doc = document,
        nav = navigator;

    var SWFWheel = window.SWFWheel = function (id)
    {
        this.setUp(id);
        if (SWFWheel.browser.msie)
            this.bind4msie();
        else
            this.bind();
    };

    SWFWheel.prototype = {
        setUp: function (id)
        {
            var el = SWFWheel.retrieveObject(id);
            if (el.nodeName.toLowerCase() == 'embed' || SWFWheel.browser.safari)
                el = el.parentNode;
            this.target = el;
            this.eventType = SWFWheel.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel';
            
        },

        bind: function ()
        {
            this.target.addEventListener(this.eventType, function (evt)
            {
                var target,
                    name,
                    delta = 0;
                // retrieve real node from XPCNativeWrapper.
                if (/XPCNativeWrapper/.test(evt.toString()))
                {
                    // FIXME: embed element has no id attributes on `AC_RunContent`.
                    var k = evt.target.getAttribute('id') || evt.target.getAttribute('name');
                    if (!k) return;
                    target = SWFWheel.retrieveObject(k);
                }
                else
                {
                    target = evt.target;
                }
                name = target.nodeName.toLowerCase();
                // check target node.
                if (name != 'object' && name != 'embed') return;
                // kill process.
                if (!target.checkBrowserScroll())
                {
                    evt.preventDefault();
                    evt.returnValue = false;
                }
                // execute wheel event if exists.
                if (!target.triggerMouseEvent) return;
                // fix delta value.
                switch (true)
                {
                    case SWFWheel.browser.mozilla:
                        delta = -evt.detail;
                        break;

                    case SWFWheel.browser.opera:
                        delta = evt.wheelDelta / 40;
                        break;

                    default:
                        //  safari, stainless, opera and chrome.
                        delta = evt.wheelDelta / 80;
                        break;
                }
                target.triggerMouseEvent(delta, evt.ctrlKey, evt.altKey, evt.shiftKey);
            }, false);
        },

        bind4msie: function ()
        {
            var _wheel,
                _unload,
                target = this.target;

            _wheel = function ()
            {
                var evt = win.event,
                    delta = 0,
                    name = evt.srcElement.nodeName.toLowerCase();

                if (name != 'object' && name != 'embed') return;
                if (!target.checkBrowserScroll())
                    evt.returnValue = false;
                //  will trigger when wmode is `opaque` or `transparent`.
                if (!target.triggerMouseEvent) return;
                delta = evt.wheelDelta / 40;
                target.triggerMouseEvent(delta, evt.ctrlKey, evt.altKey, evt.shiftKey);
            };
            _unload = function ()
            {
                target.detachEvent('onmousewheel', _wheel);
                win.detachEvent('onunload', _unload);
            };
            target.attachEvent('onmousewheel', _wheel);
            win.attachEvent('onunload', _unload);
        }
    };

    //  utilities. ------------------------------------------------------------
    SWFWheel.browser = (function ()
    {
        var ua = nav.userAgent.toLowerCase(),
            pl = nav.platform.toLowerCase(),
            version,
            pv = [0, 0, 0];

        if (nav.plugins && nav.plugins['Shockwave Flash'])
        {
            version = nav.plugins['Shockwave Flash']
                         .description
                         .replace(/^.*\\s+(\\S+\\s+\\S+$)/, '$1');
            pv[0] = parseInt(version.replace(/^(.*)\\..*$/, '$1'), 10);
            pv[1] = parseInt(version.replace(/^.*\\.(.*)\\s.*$/, '$1'), 10);
            pv[2] = /[a-z-A-Z]/.test(version) ?
                    parseInt(version.replace(/^.*[a-zA-Z]+(.*)$/, '$1'), 10) : 0;
        }
        else if (win.ActiveXObject)
        {
            try
            {
                var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (axo)
                {
                    version = axo.GetVariable('$version');
                    if (version)
                    {
                        version = version.split(' ')[1].split(',');
                        pv[0] = parseInt(version[0], 10);
                        pv[1] = parseInt(version[1], 10);
                        pv[2] = parseInt(version[2], 10);
                    }
                }
            }
            catch (e) {}
        }
        
        return {
            win: pl ? /win/.test(pl) : /win/.test(ua),
            mac: pl ? /mac/.test(pl) : /mac/.test(ua),
            playerVersion: pv,
        	version: (ua.match(/.+(?:rv|it|ra|ie)[\/:\\s]([\\d.]+)/)||[0,'0'])[1],
            chrome: /chrome/.test(ua),
            stainless: /stainless/.test(ua),
            safari: /webkit/.test(ua) && !/(chrome|stainless)/.test(ua),
            opera: /opera/.test(ua),
            msie: /msie/.test(ua) && !/opera/.test(ua),
            mozilla: /mozilla/.test(ua) && !/(compatible|webkit)/.test(ua)
        }
    })();

    SWFWheel.join = function (id)
    {
        var t = setInterval(function ()
        {
            if (SWFWheel.retrieveObject(id))
            {
                clearInterval(t);
                new SWFWheel(id);
            }
        }, 0);
    };

    /**
     *  0: always triggered with naitive event.
     *  1: if prevent default event process, will need hack.
     *  2: always triggered with hacked event.
     */
    SWFWheel.getState = function (id)
    {
        var STATE_HACKED = 2,
            STATE_IF_NEEDED = 1,
            STATE_NATIVE = 0,
            br = SWFWheel.browser,
            fp = br.playerVersion;

        if (br.mac)
        {
            if (fp[0]>=10 && fp[1]>=1)
            {
                if (br.safari||br.stainless) return STATE_NATIVE;
                else if (br.chrome) return STATE_IF_NEEDED;
                else return STATE_HACKED;
            }
            else
            {
                return STATE_HACKED;
            }
        }
        // always needs hack on windows safari under fp 10.0
        if (!(fp[0]>=10 && fp[1]>=1) && SWFWheel.browser.safari) return STATE_HACKED;

        var el = SWFWheel.retrieveObject(id),
            name = el.nodeName.toLowerCase(),
            wmode = '';

        if (name == 'object')
        {
            var k,
                param,
                params = el.getElementsByTagName('param'),
                len = params.length;

            for (var i=0; i<len; i++)
            {
                param = params[i];
                //  FIXME: getElementsByTagName is broken on IE?
                if (param.parentNode != el) continue;

                k = param.getAttribute('name');
                wmode = param.getAttribute('value') || '';
                if (/wmode/i.test(k)) break;
            }
        }
        else if (name == 'embed')
        {
            wmode = el.getAttribute('wmode') || '';
        }
        //
        if (br.msie)
        {
            if (/transparent/i.test(wmode)) return STATE_HACKED;
            else if (/opaque/i.test(wmode)) return STATE_IF_NEEDED;
            else return STATE_NATIVE;
        }
        else
        {
            if (/opaque|transparent/i.test(wmode)) return STATE_HACKED;
            else return STATE_NATIVE;
        }
    };

    SWFWheel.retrieveObject = function (id)
    {
        var el = doc.getElementById(id);
        //  FIXME: fallback for `AC_FL_RunContent`.
        if (!el)
        {
            var nodes = doc.getElementsByTagName('embed'),
                len = nodes.length;

            for (var i=0; i<len; i++)
            {
                if (nodes[i].getAttribute('name') == id)
                {
                    el = nodes[i];
                    break;
                }
            }
        }
        return el;
    };

})();
