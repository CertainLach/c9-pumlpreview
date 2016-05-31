define(function (require, exports, module) {
    main.consumes = ["Previewer", "ui"];
    main.provides = ["pumlpreview"];
    return main;

    function main(options, imports, register) {
        var Previewer = imports.Previewer;
        var ui = imports.ui;

        var deflate = require("./deflate.js");
        var deflateObj={};
        deflate(deflateObj);
        var puml = require("./puml.js");

        /***** Initialization *****/

        var plugin = new Previewer("F6CF", main.consumes, {
            caption: "Puml graph preview",
            index: 100,
            selector: function (path) {
                return path && path.match(/(?:\.txt)$/);
            }
        });

        var generated = false;

        function generate() {
            if (generated) return;
            generated = true;

            ui.insertCss(require("text!./puml.css"), plugin);

            // emit("draw");
        }

        /***** Methods *****/

        function update(e) {
            var session = plugin.activeSession;
            session.pre.src = puml(session.previewTab.document.value,deflateObj);
        }

        /***** Lifecycle *****/

        plugin.on("load", function () {

        });
        plugin.on("sessionStart", function (e) {
            var session = e.session;
            var editor = e.editor;

            generate();

            var div = document.createElement("div");
            div.className = "puml";
            var span = document.createElement('span');
            span.className = 'pumlcenterer';
            div.appendChild(span);
            var img = document.createElement('img');
            img.className = 'pumlcentered';
            div.appendChild(img);

            editor.container.appendChild(div);

            // Append PRE element
            session.pre = img;
            session.editor = editor;
        });
        plugin.on("sessionEnd", function (e) {
            var pre = e.session.pre;
            pre.parentNode.removeChild(pre);
        });
        plugin.on("sessionActivate", function (e) {
            var session = e.session;

            session.pre.style.display = "";
            session.editor.setLocation(session.path);
            session.editor.setButtonStyle("Puml Preview", "page_white.png");

            session.editor.getElement("btnPopOut").hide();
            session.editor.getElement("btnSettings").hide();
        });
        plugin.on("sessionDeactivate", function (e) {
            var session = e.session;
            session.pre.style.display = "none";
        });
        plugin.on("navigate", function (e) {
            var tab = plugin.activeDocument.tab;
            var session = plugin.activeSession;

            tab.title =
                tab.tooltip = "[P] " + e.url;
            session.editor.setLocation(e.url);

            update();
        });
        plugin.on("update", update);
        plugin.on("reload", update);
        plugin.on("enable", function () {

        });
        plugin.on("disable", function () {

        });
        plugin.on("unload", function () {
            generated = false;
        });

        /***** Register and define API *****/

        /**
         * Previewer for UTF-8 content.
         **/
        plugin.freezePublicAPI({});

        register(null, {
            "pumlpreview": plugin
        });
    }
});