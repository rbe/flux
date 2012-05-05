/*!
 * Flux
 * Form API.
 * 
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 * 
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 * 
 */
FLUX.UI.FORM = {
    
    /*
     * Save informations about rendered forms.
     */
    forms: {},
    
    /*
     *
     * @param map A map:
     *            placement: Where to place the content?
     */
    renderField: function(map) {
        //
        var text = '';
        for (f in map.fields) {
            var field = map.fields[f];
            var divId = map.formId + '-' + f;
            text += '<label id="' + f + '-label" class="desc" for="' + f + '">' + field.title + '</label>';
            switch (field.type) {
                case 'string':
                    if (field.value == undefined) field.value = '';
                    text += '<div id="' + divId + '"><input id="' + f + '" class="field text full" name="' + f + '" value="' + field.value + '"></div>';
                    break;
                case 'textarea':
                    if (field.value == undefined) field.value = '';
                    text += '<div id="' + divId + '"><textarea id="' + f + '" class="' + field.cssClass + '" name="' + f + '">' + field.value + '</textarea></div>';
                    break;
                case 'checkbox':
                    text += '<div id="' + divId + '"><input id="' + f + '" class="' + field.cssClass + '" name="' + f + '" type="checkbox" ' + field.value + '></input></div>';
                    break;
                case 'file':
                    text += '<div id="' + divId + '"><input id="' + f + '" class="field" name="' + f + '" type="file"></div>';
                    text += '<div id="' + f + '-upload-status"></div>';
                    break;
            }
            // Add support for messages for a field
            text += '<div id="' + f + '-message" style="display: none;"></div>';
            text += '</li>';
        }
        // Set text at ...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
        } else {
            return text;
        }
    },
    
    /*
     *
     * @param map A map:
     *            formId: ID of the form.
     */
    renderForm: function(map) {
        // Check map
        if (!map.action) map.action = {};
        // Generated HTML text
        var text = "";
        /*
        // Do we need an iframe for file uploads?
        var uploadForm = false;
        */
        // ID for iframe used for uploads
        var uploadIframeId = map.formId + "Upload";
        // Upload: name for iframe
        var iframeOnLoadFnName = uploadIframeId + 'OnLoadFn';
        // Initialize forms settings cache
        this.forms[map.formId] = {};
        // Settings
        var setting = FLUX.UI.FORM.forms[map.formId];
        // Process fields
        var fieldsHtml = "";
        if (map.fields) {
            fieldsHtml = this.renderField({ formId: map.formId, fields: map.fields });
        }
        // Buttons
        var buttonsHtml = "";
        if (map.buttons) {
            for (b in map.buttons) {
                var button = map.buttons[b];
                buttonsHtml += '<li>';
                buttonsHtml += FLUX.UI.WIDGET.renderButton({ buttonId: b, title: button.title });
                buttonsHtml += '</li>';
            }
        }
        // Open form
        text += '<form class="forms" id="' + map.formId + '"';
        // Does this form contain a file uplaod?
        for (f in map.fields) {
            if (map.fields[f].type == 'file') {
                setting['uploadForm'] = true;
                break;
            }
        }
        // Set enctype and method for file upload?
        if (setting['uploadForm']) {
            map.action.method = "post";
            text += ' enctype="multipart/form-data" target="' + uploadIframeId + '"';
        }
        // Method
        text += ' method="' + map.action.method + '"';
        // Action
        if (typeof(map.action.url) == 'function') {
        } else {
            text += ' action="' + map.action.url + '"';
        }
        text +=  '>';
        // Fields and buttons
        text += '<fieldset>';
        text += '<ul>';
        text += fieldsHtml;
        text += buttonsHtml;
        text += '</ul>';
        text += '</fieldset>';
        // Close form
        text += '</form>';
        // Generate iframe for file uploads?
        if (setting['uploadForm']) {
            /*
            var bla = function(iframe) {
                var iDoc = iframe.contentWindow || iframe.contentDocument;
                if (iDoc.document) {
                    iDoc.document.body.addEventListener('afterLayout', function() { console.log('works'); }, true);
                };
                bla(document.getElementsByTagName("' + uploadIframeId + '")[0]);
            }
            */
            // Generate 'on load' callback for iframe
            if (map.iframeOnLoad) {
                FLUX.includeJavaScript('var ' + iframeOnLoadFnName + ' = ' + map.iframeOnLoad);
            }
            // Generate iframe
            text += '<iframe id="' + uploadIframeId + '" name="' + uploadIframeId + '" style="display: none; width: 100%; min-height: 330px"';
            if (map.iframeOnLoad) {
                text += ' onLoad="' + iframeOnLoadFnName + '();"';
            }
            text += '>';
            text += '</iframe>';
        }
        if (typeof(map.action.url) == 'function') {
            setting['actionFn'] = map.action.url;
        }
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            FLUX.UI.placeContent(map.placement);
            // Add button action(s)
            for (b in map.buttons) {
                var button = map.buttons[b];
                jQuery('#' + b).click(function() {
                    // Execute action before form is submitted
                    if (button.preSubmitAction) {
                        button.preSubmitAction();
                    }
                    // Update action through function?
                    var actionFn = setting['actionFn'];
                    if (actionFn) {
                        jQuery('#' + map.formId).attr('action', actionFn());
                    }
                    // Upload: reset iframe when upload begins
                    if (setting['uploadForm']) {
                        var o = jQuery('#' + uploadIframeId);
                        o.contents().find('body').html('');
                    }
                    // Execute button's click event handler/function
                    if (button.action) {
                        button.action();
                    } else { // Execute standard action
                        jQuery('#' + map.formId).submit();
                    }
                    // Execute action after form was submitted
                    if (button.postSubmitAction) {
                        button.postSubmitAction();
                    }
                });
                /*
                if (button.action) {
                    // Set default action
                    if (!button.action.method) button.action.method = 'GET';
                    // Setup ajax communication
                    jQuery('#' + b).click(function() {
                        jQuery.ajax({
                            type: button.action.method,
                            url: button.action.url,
                            error: button.action.error,
                            success: button.action.success
                        });
                    });
                }
                */
            }
        } else {
            return text;
        }
    },
    
};

