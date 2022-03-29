(self["define"]=self["define"]||[]).push([[121],{76392:function(t){!function(e,n){t.exports=n()}(0,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",s="second",i="minute",a="hour",c="day",o="week",u="month",l="quarter",d="year",f="date",h="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,m=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,_={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},C=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:C,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),s=n%60;return(e<=0?"+":"-")+C(r,2,"0")+":"+C(s,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),s=e.clone().add(r,u),i=n-s<0,a=e.clone().add(r+(i?-1:1),u);return+(-(r+(n-s)/(i?s-a:a-s))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:d,w:o,d:c,D:f,h:a,m:i,s:s,ms:r,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",y={};y[g]=_;var p=function(t){return t instanceof D},M=function(t,e,n){var r;if(!t)return g;if("string"==typeof t)y[t]&&(r=t),e&&(y[t]=e,r=t);else{var s=t.name;y[s]=t,r=s}return!n&&r&&(g=r),r||!n&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new D(n)},b=v;b.l=M,b.i=p,b.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var D=function(){function _(t){this.$L=M(t.locale,null,!0),this.parse(t)}var C=_.prototype;return C.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var s=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},C.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},C.$utils=function(){return b},C.isValid=function(){return!(this.$d.toString()===h)},C.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},C.isAfter=function(t,e){return w(t)<this.startOf(e)},C.isBefore=function(t,e){return this.endOf(e)<w(t)},C.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},C.unix=function(){return Math.floor(this.valueOf()/1e3)},C.valueOf=function(){return this.$d.getTime()},C.startOf=function(t,e){var n=this,r=!!b.u(e)||e,l=b.p(t),h=function(t,e){var s=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?s:s.endOf(c)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},m=this.$W,_=this.$M,C=this.$D,v="set"+(this.$u?"UTC":"");switch(l){case d:return r?h(1,0):h(31,11);case u:return r?h(1,_):h(0,_+1);case o:var g=this.$locale().weekStart||0,y=(m<g?m+7:m)-g;return h(r?C-y:C+(6-y),_);case c:case f:return $(v+"Hours",0);case a:return $(v+"Minutes",1);case i:return $(v+"Seconds",2);case s:return $(v+"Milliseconds",3);default:return this.clone()}},C.endOf=function(t){return this.startOf(t,!1)},C.$set=function(t,e){var n,o=b.p(t),l="set"+(this.$u?"UTC":""),h=(n={},n[c]=l+"Date",n[f]=l+"Date",n[u]=l+"Month",n[d]=l+"FullYear",n[a]=l+"Hours",n[i]=l+"Minutes",n[s]=l+"Seconds",n[r]=l+"Milliseconds",n)[o],$=o===c?this.$D+(e-this.$W):e;if(o===u||o===d){var m=this.clone().set(f,1);m.$d[h]($),m.init(),this.$d=m.set(f,Math.min(this.$D,m.daysInMonth())).$d}else h&&this.$d[h]($);return this.init(),this},C.set=function(t,e){return this.clone().$set(t,e)},C.get=function(t){return this[b.p(t)]()},C.add=function(r,l){var f,h=this;r=Number(r);var $=b.p(l),m=function(t){var e=w(h);return b.w(e.date(e.date()+Math.round(t*r)),h)};if($===u)return this.set(u,this.$M+r);if($===d)return this.set(d,this.$y+r);if($===c)return m(1);if($===o)return m(7);var _=(f={},f[i]=e,f[a]=n,f[s]=t,f)[$]||1,C=this.$d.getTime()+r*_;return b.w(C,this)},C.subtract=function(t,e){return this.add(-1*t,e)},C.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",s=b.z(this),i=this.$H,a=this.$m,c=this.$M,o=n.weekdays,u=n.months,l=function(t,n,s,i){return t&&(t[n]||t(e,r))||s[n].substr(0,i)},d=function(t){return b.s(i%12||12,t,"0")},f=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:c+1,MM:b.s(c+1,2,"0"),MMM:l(n.monthsShort,c,u,3),MMMM:l(u,c),D:this.$D,DD:b.s(this.$D,2,"0"),d:String(this.$W),dd:l(n.weekdaysMin,this.$W,o,2),ddd:l(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(i),HH:b.s(i,2,"0"),h:d(1),hh:d(2),a:f(i,a,!0),A:f(i,a,!1),m:String(a),mm:b.s(a,2,"0"),s:String(this.$s),ss:b.s(this.$s,2,"0"),SSS:b.s(this.$ms,3,"0"),Z:s};return r.replace(m,(function(t,e){return e||$[t]||s.replace(":","")}))},C.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},C.diff=function(r,f,h){var $,m=b.p(f),_=w(r),C=(_.utcOffset()-this.utcOffset())*e,v=this-_,g=b.m(this,_);return g=($={},$[d]=g/12,$[u]=g,$[l]=g/3,$[o]=(v-C)/6048e5,$[c]=(v-C)/864e5,$[a]=v/n,$[i]=v/e,$[s]=v/t,$)[m]||v,h?g:b.a(g)},C.daysInMonth=function(){return this.endOf(u).$D},C.$locale=function(){return y[this.$L]},C.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=M(t,e,!0);return r&&(n.$L=r),n},C.clone=function(){return b.w(this.$d,this)},C.toDate=function(){return new Date(this.valueOf())},C.toJSON=function(){return this.isValid()?this.toISOString():null},C.toISOString=function(){return this.$d.toISOString()},C.toString=function(){return this.$d.toUTCString()},_}(),S=D.prototype;return w.prototype=S,[["$ms",r],["$s",s],["$m",i],["$H",a],["$W",c],["$M",u],["$y",d],["$D",f]].forEach((function(t){S[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,D,w),t.$i=!0),w},w.locale=M,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=y[g],w.Ls=y,w.p={},w}))},45161:function(t,e,n){"use strict";n.d(e,{Z:function(){return f}});n(77610);var r=n(69417),s=n(19812),i=n(55893);function a(t,e,n,a,c,o){const u=r.Q0;return(0,s.wg)(),(0,s.j4)(u,{content:a.buildDesc,"raw-content":""},{default:(0,s.w5)((()=>[(0,s.Uk)("#"+(0,i.zw)(a.buildTime),1)])),_:1},8,["content"])}var c=n(76392),o=n.n(c),u={setup(){const t=o()(Number("1648521392922")),e="829b5cf6",n="null";return{buildTime:"2203291036",buildDesc:`#${e} - ${t.format("YYYY-MM-DD HH:mm:ss")}${n?"<br/ >"+n.replace(/\n/g,"<br>"):""}`}}},l=n(48998);const d=(0,l.Z)(u,[["render",a]]);var f=d},63916:function(t,e,n){"use strict";n.d(e,{Z:function(){return $}});var r=n(19812);const s={viewBox:"0 0 98 87"},i=(0,r._)("path",{d:"M37.89 3.15c.76 5.05 1.56 10.9-1.67 15.29-3.21 4.15-9.29 4.99-11.49 10.04-5.62-1.73-1.65-10.1 2.21-12.63 1.91-3 2.03 1.98 2.93 3.35 1.67-5.85 6.52-10.13 8.02-16.05zM60.62 4.72c3.66 4.98 7.34 10.41 9.03 16.51.52-1.96-1.37-5.61 1.39-6.12 4.96 3.08 6.45 8.31 5.6 13.85 4.32 7.66 5.8 17.4 1.93 25.53-4.27 7.32-11.68 13.31-20.36 14 .4-2.81 4.82-3.24 4.25-6.4-.71-3.85 2.11-6.92 4.53-9.5 3.23.48-.61 12.88 2.96 7.3-2.03-4.58 1.22-8.81 2.11-13.2 2.51 1.71 2.85 4.91 3.94 7.51 4.51-5.34-6.01-7.76-3.22-13.65 2.8-1.24 4.6 1.11 6.37 2.85.24-2.74-1.61-4.52-3.4-6.24.17-4.39-.8-8.98-4.06-12.13-4.23-2.77-9.5-5.18-11.06-10.42-.34-3.29-.25-6.6-.01-9.89zM18.45 22.59c.22-.13.65-.38.87-.5 3.74 5.71-1.74 11.02-2.48 16.67-2.93-3.72-2.15-12.21 1.61-16.17z"},null,-1),a=(0,r._)("path",{d:"M79.58 21.99c4.63 3.65 5.76 11.91 2.53 16.67-1.12-5.54-6.01-10.96-2.53-16.67zM33.45 24.43c10.69-.08 21.39-.1 32.08.01-1.41 5.15 4.3 1.28 6.4 3.65 3.56 3.6 2.41 9.51-.82 12.94-2.23 2.08-2.31 6.6-6.28 5.62-1.88 7.6-11.21 9.36-13.49 16.42-2.24 6.87 8.01 6.25 9.43 11.34-7.54.18-15.1.21-22.63-.02 1.47-3.68 6.54-4.58 9.49-7.15 1.89-6.66-4.8-10.18-8.97-13.77-3.08-2.01-2.97-8.02-7.56-6.94-2.56-5.5-8.55-10.82-4.95-17.38 1.52-4.17 8.77.91 7.3-4.72m-5.13 6.02c-3.19 3.82.36 10.47 4.83 11.72-.03-4.18 2.33-14.84-4.83-11.72m38.03.16c-1.97 3.15-.18 8.37-.7 12.27 3.41-2.1 6.85-5.56 6.07-9.94.36-2.96-3.36-4.28-5.37-2.33m-16.69 2.13c-1.19 3.98-4.09 5.76-7.69 7.35 4.46.54 6.32 3.96 8.08 7.57.23-4.49 3.69-6.73 7.68-7.66-2.51-1.34-6.37-1.64-6.8-5.08-.48-.32-.53-3.61-1.27-2.18z"},null,-1),c=(0,r._)("path",{d:"M22.32 29.78c4.09 4.94-2.14 8.68-2.38 13.39 1.59-1.44 3.39-4.05 5.84-2.55 3.33 5.69-7.6 8.16-2.94 13.59 1.02-2.74 1.97-5.52 3.44-8.05 1.59 4.04 4.35 8.35 2.94 12.86-.5 1.2.73 2.08 1.31 2.99.21-2.93-.64-6.08.69-8.84 3.77 1 5.82 6.01 5.32 9.76-.07 2.75 4.04 2.87 4.18 5.54-14.32-1.08-26.55-16.67-21.99-30.8.99-2.52 1.96-7.13 3.59-7.89zM85.79 36.64c4.49 3.4 1.4 13.52-3.99 16.45 1.05-5.52.26-11.74 3.99-16.45z"},null,-1),o=(0,r._)("path",{d:"M11.6 37.26c6.29 1.33 3.98 10.84 5.29 15.81-5.08-3.59-6.87-9.9-5.29-15.81zM84.49 53.8c1.04-.27 2.1-.5 3.17-.69-3.35 4.56-6.8 10.6-13.5 9.68 2.7-3.48 5.71-7.81 10.33-8.99zM12.93 54.01c5.74-.38 8.52 5.29 11.85 8.87-5.44.33-10.7-3.53-11.85-8.87zM21.06 65.54c5.49-3.02 10.17 2.65 14.95 4.57-5.19.58-11.92.43-14.95-4.57zM71.31 65.33c2.05-.93 4.59-1.03 6.53.22-2.92 4.77-9.64 5.18-14.71 4.58 2.72-1.62 5.41-3.28 8.18-4.8zM33.36 76.58c1.81-.09 3.4.36 4.59 1.77-2.97 1.53-6.72 2.18-8.46 4.81.21-2.77 2.97-4.61 3.87-6.58zM62.82 77.09c3.22-1.7 5.81 3.26 6.32 6.13-.71-3.6-10.85-3.74-6.32-6.13z"},null,-1),u=[i,a,c,o];function l(t,e){return(0,r.wg)(),(0,r.iD)("svg",s,u)}var d=n(48998);const f={},h=(0,d.Z)(f,[["render",l]]);var $=h},11296:function(t,e,n){"use strict";n.d(e,{Z:function(){return d}});var r=n(19812);const s={viewBox:"0 0 204 204"},i=(0,r._)("g",null,[(0,r._)("path",{d:" M 92.79 59.13 C 94.98 55.32 98.53 52.56 101.92 49.88 C 105.14 52.74 108.92 55.30 111.02 59.15 C 110.63 62.49 107.80 65.92 104.21 65.83 C 101.15 65.86 97.27 66.68 95.10 63.91 C 93.97 62.56 92.73 60.98 92.79 59.13 Z"}),(0,r._)("path",{d:" M 82.38 54.26 C 82.72 54.23 83.41 54.17 83.76 54.14 C 86.77 57.18 89.10 60.84 92.29 63.72 C 93.95 65.58 96.89 67.68 95.57 70.52 C 93.68 75.27 90.04 79.03 87.26 83.27 C 85.94 84.91 84.25 87.99 81.72 86.52 C 79.39 83.07 77.68 79.20 75.02 75.95 C 73.64 73.84 70.87 71.42 72.69 68.75 C 75.49 63.69 78.35 58.47 82.38 54.26 Z"}),(0,r._)("path",{d:" M 119.11 54.95 C 120.87 52.96 122.79 55.72 123.89 57.04 C 126.97 61.41 130.22 65.85 132.00 70.92 C 128.93 76.45 124.76 81.37 121.83 87.03 C 121.20 86.96 119.95 86.83 119.33 86.77 C 116.16 82.55 113.06 78.28 110.00 73.99 C 108.50 71.78 106.78 68.39 109.16 66.15 C 112.65 62.58 116.01 58.89 119.11 54.95 Z"}),(0,r._)("path",{d:" M 51.82 63.56 C 58.70 63.02 64.12 67.97 68.08 72.99 C 72.28 77.62 75.21 83.19 78.32 88.57 C 80.70 92.48 79.50 97.42 81.68 101.44 C 84.44 88.13 95.06 78.87 101.41 67.39 C 103.21 69.06 104.59 71.10 105.93 73.15 C 111.83 81.55 119.56 89.46 121.42 99.94 C 121.88 99.79 122.79 99.50 123.25 99.35 C 123.62 95.93 123.59 92.31 125.30 89.22 C 129.75 80.82 134.83 72.41 142.47 66.52 C 145.21 64.40 148.62 63.50 152.06 63.57 C 150.18 68.18 148.61 72.98 148.91 78.04 C 148.87 91.80 143.22 105.66 132.73 114.74 C 129.22 118.10 124.49 120.51 122.54 125.21 C 127.83 124.55 132.04 121.10 136.38 118.32 C 145.39 112.57 154.03 106.14 161.79 98.78 C 167.77 93.07 171.20 85.51 174.16 77.96 C 176.45 77.74 177.07 80.44 178.09 81.97 C 181.72 88.26 181.50 95.83 180.67 102.81 C 179.03 109.41 175.27 115.68 169.55 119.51 C 161.87 124.32 153.00 127.10 143.98 127.83 C 140.96 128.00 137.94 128.52 135.19 129.85 C 136.01 134.37 136.26 139.44 133.24 143.26 C 129.03 150.23 118.48 151.96 112.25 146.74 C 108.03 143.08 106.71 137.40 103.80 132.82 C 102.28 133.14 100.11 132.48 99.28 134.22 C 96.79 138.38 95.66 143.53 91.73 146.71 C 87.38 150.49 80.82 150.55 75.80 148.14 C 72.69 146.31 70.33 143.26 68.96 139.95 C 67.64 136.66 68.75 133.04 68.04 129.67 C 65.75 128.01 62.69 128.23 60.02 127.83 C 51.21 127.21 42.64 124.39 35.05 119.91 C 28.95 116.19 24.96 109.66 23.29 102.82 C 22.58 95.83 22.21 88.24 25.83 81.92 C 26.84 80.41 27.51 77.79 29.76 77.99 C 31.70 81.87 32.72 86.19 35.15 89.83 C 41.41 100.09 51.57 106.93 61.00 113.98 C 67.60 117.93 73.49 123.71 81.26 125.19 C 79.42 120.47 74.79 118.01 71.24 114.75 C 60.50 105.43 54.82 91.11 55.06 76.99 C 55.35 72.26 53.43 67.89 51.82 63.56 M 72.72 129.22 C 72.52 135.00 78.56 138.93 83.85 138.62 C 87.70 138.20 90.56 135.35 93.11 132.70 C 87.27 128.33 79.61 128.62 72.72 129.22 M 110.90 132.29 C 112.59 134.55 114.51 136.81 117.21 137.86 C 123.13 140.54 131.06 135.91 131.17 129.27 C 124.29 128.39 117.05 128.76 110.90 132.29 Z"})],-1),a=[i];function c(t,e){return(0,r.wg)(),(0,r.iD)("svg",s,a)}var o=n(48998);const u={},l=(0,o.Z)(u,[["render",c]]);var d=l},38558:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return G}});var r=n(19812),s=n(55893),i=n(99919),a=n(28798);const c=(0,r._)("span",{style:{"font-family":"genshin"}},"椰羊 · 首页",-1),o=(0,r.Uk)(" 椰羊cocogoat "),u=(0,r._)("small",null,"纯网页圣遗物管理·成就扫描·更多功能开发中",-1),l=[o,u],d=(0,r._)("div",{class:"card-title"},"额外工具",-1),f={class:"card-body"},h={class:"circle"},$=(0,r._)("img",{src:i},null,-1),m={class:"svg-w"},_=(0,r._)("div",{class:"text"},[(0,r.Uk)("扫描成就并导出"),(0,r._)("br"),(0,r.Uk)("到Paimon.moe")],-1),C={class:"circle"},v=(0,r._)("img",{style:{"border-color":"#cb98ff"},src:a},null,-1),g={class:"svg-w",style:{background:"#cb98ff"}},y=(0,r._)("div",{class:"text"},[(0,r.Uk)("扫描成就并导出"),(0,r._)("br"),(0,r.Uk)("到Seelie.me")],-1),p={class:"circle"},M={class:"img",style:{"border-color":"#0079cc"}},w={class:"svg-w",style:{background:"#0079cc"}},b=(0,r._)("div",{class:"text"},[(0,r.Uk)("PC端"),(0,r._)("br"),(0,r.Uk)("更新包列表")],-1),D={class:"circle"},S={class:"img",style:{"border-color":"#1e1e1e"}},k={class:"svg-w",style:{background:"#1e1e1e"}},O=(0,r._)("div",{class:"text"},[(0,r.Uk)("OpenCV.js"),(0,r._)("br"),(0,r.Uk)("Playground")],-1),x=(0,r._)("h4",null,"开源地址",-1),W=(0,r._)("div",null,"本工具已在Github以BSD-3协议完全开源，可任意修改使用",-1),z=(0,r._)("h4",null,"接入文档",-1),Y=(0,r._)("div",null,"本工具中各类扫描器组件均提供接口，可以嵌入到任何项目中",-1),Z=(0,r._)("h4",null,"本地使用",-1),T=(0,r._)("div",null,"如需离线使用，请点这里下载本地专用版。",-1),U=(0,r._)("h4",null,"反馈聊天",-1),H=(0,r._)("div",null,"无论功能反馈还是聊天吹水，都可以加入反馈群( 933468075 )",-1),L=(0,r.Uk)("©2022 YuehaiTeam cocogoat.work ");function I(t,e,n,i,a,o){const u=(0,r.up)("icon-achievement"),I=(0,r.up)("router-link"),A=(0,r.up)("fa-icon"),j=(0,r.up)("icon-cocogoat"),q=(0,r.up)("build-info"),N=(0,r.up)("Layout");return(0,r.wg)(),(0,r.j4)(N,{class:(0,s.C_)(t.$style.home)},{title:(0,r.w5)((()=>[c])),default:(0,r.w5)((()=>[(0,r._)("div",{class:(0,s.C_)(t.$style.root)},[(0,r._)("h1",{class:(0,s.C_)(t.$style.title)},l,2),(0,r._)("div",null,[(0,r._)("div",{class:(0,s.C_)(t.$style.card)},[d,(0,r._)("div",f,[(0,r.Wm)(I,{class:(0,s.C_)(t.$style.extraOne),to:"/achievement/scan-and-export?to=paimon-moe"},{default:(0,r.w5)((()=>[(0,r._)("div",h,[$,(0,r._)("div",m,[(0,r.Wm)(u)])]),_])),_:1},8,["class"]),(0,r.Wm)(I,{class:(0,s.C_)(t.$style.extraOne),style:{color:"#7424c5"},to:"/achievement/scan-and-export?to=seelie"},{default:(0,r.w5)((()=>[(0,r._)("div",C,[v,(0,r._)("div",g,[(0,r.Wm)(u,{style:{fill:"#7424c5"}})])]),y])),_:1},8,["class"]),(0,r.Wm)(I,{class:(0,s.C_)(t.$style.extraOne),style:{color:"#0079cc"},to:{name:"installer.index"}},{default:(0,r.w5)((()=>[(0,r._)("div",p,[(0,r._)("div",M,[(0,r.Wm)(A,{icon:"box-open"})]),(0,r._)("div",w,[(0,r.Wm)(j,{style:{fill:"#fff"}})])]),b])),_:1},8,["class","to"]),(0,r.Wm)(I,{class:(0,s.C_)(t.$style.extraOne),style:{color:"#1e1e1e"},to:{name:"extra.playground"}},{default:(0,r.w5)((()=>[(0,r._)("div",D,[(0,r._)("div",S,[(0,r.Wm)(A,{icon:"terminal"})]),(0,r._)("div",k,[(0,r.Wm)(j,{style:{fill:"#fff"}})])]),O])),_:1},8,["class","to"])])],2)]),(0,r._)("div",{class:(0,s.C_)(t.$style.cardList)},[(0,r._)("a",{class:(0,s.C_)(t.$style.card),href:"http://github.com/yuehaiTeam/cocogoat",target:"_blank"},[(0,r.Wm)(A,{icon:["fab","github-alt"]}),x,W],2),(0,r._)("a",{class:(0,s.C_)(t.$style.card),href:"https://github.com/YuehaiTeam/cocogoat/tree/main/docs",target:"_blank"},[(0,r.Wm)(A,{icon:"infinity"}),z,Y],2),(0,r._)("a",{class:(0,s.C_)(t.$style.card),href:"http://77.cocogoat.work/web/",target:"_blank"},[(0,r.Wm)(A,{icon:"folder-tree"}),Z,T],2),(0,r._)("a",{class:(0,s.C_)(t.$style.card),href:"https://jq.qq.com/?_wv=1027&k=5w1TPQL4",target:"_blank"},[(0,r.Wm)(A,{icon:["fab","qq"]}),U,H],2)],2),(0,r._)("div",{class:(0,s.C_)(t.$style.copyright)},[L,(0,r.Wm)(q)],2)],2)])),_:1},8,["class"])}var A=n(1607),j=n(14287),q=n(75444),N=n(63916),B=n(11296),J=n(45161);A.vI.add(q.Nz9,q.saE,j.vqe,j.lCn,j.Jw3,j.IA$);var P=(0,r.aZ)({name:"HomeView",components:{IconAchievement:N.Z,IconCocogoat:B.Z,BuildInfo:J.Z}}),V={home:"home-af6b2c",root:"root-df1309",title:"title-b75c4c",cardList:"card-list-b621e1",card:"card-c853f3",extraOne:"extra-one-dd66de",copyright:"copyright-f73ec1"},F=n(48998);const Q={};Q["$style"]=V;const E=(0,F.Z)(P,[["render",I],["__cssModules",Q]]);var G=E},99919:function(t,e,n){"use strict";t.exports=n.p+"img/paimon.deda1c9a.png"},28798:function(t,e,n){"use strict";t.exports=n.p+"img/seelie.91afdfc4.jpg"},77610:function(t,e,n){"use strict";n(13910),n(33950)}}]);