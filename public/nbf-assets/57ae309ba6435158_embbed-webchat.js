function callAll(jsfiles) {
    var src_cmx_widget = document.createElement("script");
    src_cmx_widget.setAttribute("type", "text/javascript");
    src_cmx_widget.setAttribute("src", jsfiles);
    document.getElementsByTagName("head")[0].appendChild(src_cmx_widget);
  }

  const parent_cmx_widget = document.createElement("div");
  parent_cmx_widget.setAttribute("id", "cmx-widget-webchat");

  const HOST = document.querySelector('script[src="https://multicanal4.brbservicos.com.br/fla/embbed-webchat.js"]');
  let s1 = document.createElement("div"), s0 = HOST;
  s1.id = 'cmx-widget-webchat';
  s0.parentNode.insertBefore(s1, s0);

  callAll(`${HOST.src.split('/embbed-webchat')[0]}/widget/runtime-main.js`);
  callAll(`${HOST.src.split('/embbed-webchat')[0]}/widget/2.js`);
  callAll(`${HOST.src.split('/embbed-webchat')[0]}/widget/main.js`);