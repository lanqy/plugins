// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
//
(function($) {

    $.alerts = {

        // These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

        verticalOffset: -75, // vertical offset of the dialog from center screen, in pixels
        horizontalOffset: 0, // horizontal offset of the dialog from center screen, in pixels/
        repositionOnResize: true, // re-centers the dialog on window resize
        overlayOpacity: .01, // transparency level of overlay
        overlayColor: '#FFF', // base color of overlay
        draggable: true, // make the dialogs draggable (requires UI Draggables plugin)
        okButton: '&nbsp;确定&nbsp;', // text for the OK button
        cancelButton: '&nbsp;取消&nbsp;', // text for the Cancel button
        dialogClass: null, // if specified, this class will be applied to all dialogs
        ok: '&nbsp;是&nbsp;', // text for the OK button
        cancel: '&nbsp;否&nbsp;',

        // Public methods

        alert: function(message, title, type, callback, closeCallback) {
            if (title == null) title = '提示';
            if (type == null) type = 'alert';
            $.alerts._show(title, message, null, type, function(result) {
                if (callback) callback(result);
            }, closeCallback);
        },

        confirm: function(message, title, callback, closeCallback) {
            if (title == null) title = '提示';
            $.alerts._show(title, message, null, 'confirm', function(result) {
                if (callback) callback(result);
            }, closeCallback);
        },

        confirmT: function(message, title, callback) {
            if (title == null) title = '提示';
            $.alerts._show(title, message, null, 'confirmT', function(result) {
                if (callback) callback(result);
            });
        },

        _custom: function(message, title, type, callback, closeCallback, html) {
            if (title == null) title = '提示';
            if (type == null) type = 'alert';
            $.alerts._customShow(title, message, null, type, function(result) {
                if (callback) callback(result);
            }, closeCallback, html);
        },

        prompt: function(message, value, title, callback, closeCallback) {
            if (title == null) title = '提示';
            $.alerts._show(title, message, value, 'prompt', function(result) {
                if (callback) callback(result);
            }, closeCallback);
        },

        _customShow: function(title, msg, value, type, callback, closeCallback, html) {
            $.alerts._hide();
            $.alerts._overlay('show');
            $.alerts.build(title, msg, value, type, callback, closeCallback, html);

            $("#popup_content").after(html);
            $("#popup_ok").click(function() {
                $.alerts._hide();
                if (callback) callback(true);
            });
            $("#popup_cancel").click(function() {
                $.alerts._hide();
                if (callback) callback(false);
            });
            $("#popup_ok").focus();
            $("#popup_ok, #popup_cancel").keypress(function(e) {
                if (e.keyCode == 13) $("#popup_ok").trigger('click');
                if (e.keyCode == 27) $("#popup_cancel").trigger('click');
            });

            $.alerts._bindEvent();
        },

        // Private methods

        _dialog: function(html, callback, closeCallback) {
            $.alerts._hide();
            $.alerts._overlay('show');
            $.alerts._append(html);

            $("#popup_ok").click(function() {
                var val = $("#popup_prompt").val();
                $.alerts._hide();
                if (callback) callback(val);
            });
            $("#popup_cancel").click(function() {
                $.alerts._hide();
                if (callback) callback(null);
            });
            $.alerts._setZindex();
            $.alerts._resize();
            $.alerts._bindEvent();
        },

        _show: function(title, msg, value, type, callback, closeCallback) {

            $.alerts._hide();
            $.alerts._overlay('show');
            $.alerts.build(title, msg, value, type, callback, closeCallback);

            switch (type) {
                case 'alert':
                    $("#popup_content").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function() {
                        $.alerts._hide();
                        callback(true);
                    });
                    $("#popup_ok").focus().keypress(function(e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click');
                    });
                    break;
                case 'confirm':
                    $("#popup_content").after('<div id="popup_panel" style="left: 40%;"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_ok").click(function() {
                        $.alerts._hide();
                        if (callback) callback(true);
                    });
                    $("#popup_cancel").click(function() {
                        $.alerts._hide();
                        if (callback) callback(false);
                    });
                    $("#popup_ok").focus();
                    $("#popup_ok, #popup_cancel").keypress(function(e) {
                        if (e.keyCode == 13) $("#popup_ok").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancel").trigger('click');
                    });
                    break;

                case 'confirmT':
                    $("#popup_content").after('<div id="popup_panel" style="left: 40%;"><input type="button" value="' + $.alerts.ok + '" id="popup_okT" /> <input type="button" value="' + $.alerts.cancel + '" id="popup_cancelT" /></div>');
                    $("#popup_okT").click(function() {
                        $.alerts._hide();
                        if (callback) callback(true);
                    });
                    $("#popup_cancelT").click(function() {
                        $.alerts._hide();
                        if (callback) callback(false);
                    });
                    $("#popup_okT").focus();
                    $("#popup_okT, #popup_cancelT").keypress(function(e) {
                        if (e.keyCode == 13) $("#popup_okT").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancelT").trigger('click');
                    });
                    break;
                case 'prompt':
                    $("#popup_content").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_prompt").width($("#popup_message").width());
                    $("#popup_ok").click(function() {
                        var val = $("#popup_prompt").val();
                        $.alerts._hide();
                        if (callback) callback(val);
                    });
                    $("#popup_cancel").click(function() {
                        $.alerts._hide();
                        if (callback) callback(null);
                    });
                    $("#popup_prompt, #popup_ok, #popup_cancel").keypress(function(e) {
                        if (e.keyCode == 13) $("#popup_ok").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancel").trigger('click');
                    });
                    if (value) $("#popup_prompt").val(value);
                    $("#popup_prompt").focus().select();
                    break;
                default:
                    $("#popup_content").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function() {
                        $.alerts._hide();
                        callback(true);
                    });
                    $("#popup_ok").focus().keypress(function(e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click');
                    });
            }

            $.alerts._bindEvent();
        },

        build: function(title, msg, value, type, callback, closeCallback) {
            var tpl = '<div id="popup_container">' +
                '<h1 id="popup_title"></h1>' +
                '<a id="popup_hide" class="h-dialog_close">关闭</a>' +
                '<div id="popup_content">' +
                '<div class="h-dialog_bg"></div>' +
                '<div id="popup_message"></div>' +
                '</div>' +
                '</div>';
            $("body").append(tpl);
            $.alerts._setConfig(title, type, msg);
            $.alerts._resize();
        },

        _append: function(html) {
            $("body").append(html);
        },

        _setConfig: function(title, type, msg) {
            if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);
            $.alerts._setZindex();
            $("#popup_title").text(title);
            $("#popup_content").addClass(type);
            $("#popup_message").text(msg);
            $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
        },

        _setZindex: function() {
            $("#popup_container").css({
                position: 'fixed',
                zIndex: 99999,
                padding: 0,
                margin: 0
            });
        },

        _resize: function() {
            $("#popup_container").css({
                minWidth: $("#popup_container").outerWidth(),
                maxWidth: $("#popup_container").outerWidth()
            });
            $.alerts._reposition();
            $.alerts._maintainPosition(true);
        },

        _bindEvent: function() {

            $("#popup_hide").click(function() {
                $.alerts._hide();
                if (closeCallback) closeCallback();
            });

            // Make draggable
            if ($.alerts.draggable) {
                try {
                    $("#popup_container").draggable({
                        handle: $("#popup_title")
                    });
                    $("#popup_title").css({
                        cursor: 'move'
                    });
                } catch (e) { /* requires jQuery UI draggables */ }
            }
        },

        _hide: function() {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false);
        },

        _overlay: function(status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break;
            }
        },

        _reposition: function() {
            var el = $("#popup_container");
            var top = (($(window).height() / 2) - (el.outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - (el.outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;
            el.css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height());
        },

        _maintainPosition: function(status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break;
                }
            }
        }

    }


    // Shortuct functions

    jAlert = {
        info: function(message, title, type, callback, closeCallback) {
            $.alerts.alert(message, title, 'info', callback, closeCallback);
        },
        warn: function(message, title, type, callback, closeCallback) {
            $.alerts.alert(message, title, 'warn', callback, closeCallback);
        },
        error: function(message, title, type, callback, closeCallback) {
            $.alerts.alert(message, title, 'error', callback, closeCallback);
        },
        success: function(message, title, type, callback, closeCallback) {
            $.alerts.alert(message, title, 'success', callback, closeCallback);
        },
        custom: function(message, title, type, callback, closeCallback, html) { // custom
            $.alerts._custom(message, title, 'custom', callback, closeCallback, html);
        },
        dialog: function(html, callback, closeCallback) {
            $.alerts._dialog(html, callback, closeCallback);
        }
    };

    jConfirm = function(message, title, callback, closeCallback) {
        $.alerts.confirm(message, title, callback, closeCallback);
    };

    jConfirmT = function(message, title, callback) {
        $.alerts.confirmT(message, title, callback);
    };

    jPrompt = function(message, value, title, callback, closeCallback) {
        $.alerts.prompt(message, value, title, callback, closeCallback);
    };



})(jQuery);
