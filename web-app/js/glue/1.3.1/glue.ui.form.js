/*
 * Form API.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.UI.FORM = {
    
    /*
     *
     * @param map A map:
     *            formId: ID of the form.
     */
    renderForm: function(map) {
        // Check map
        if (!map.method) map.method = "post";
        // Generated HTML text
        var text = "";
        // Do we need an iframe for file uploads?
        var uploadForm = false;
        // ID for iframe used for uploads
        var uploadIframeId = map.formId + "-upload";
        // Process fields
        var fieldsHtml = "";
        if (map.fields) {
            for (f in map.fields) {
                var field = map.fields[f];
                var divId = map.formId + '-' + f;
                fieldsHtml += '      <li>';
                fieldsHtml += '        <label class="desc" for="' + f + '">' + field.title + '</label>';
                switch (field.type) {
                case 'string':
                    fieldsHtml += '        <div id="' + divId + '"><input id="' + f + '" class="field text full" name="' + f + '"></div>';
                    break;
                case 'textarea':
                    fieldsHtml += '        <div id="' + divId + '"><textarea id="' + f + '" class="' + field.cssClass + '" name="' + f + '"></textarea></div>';
                    break;
                case 'file':
                    uploadForm = true;
                    fieldsHtml += '        <div id="' + divId + '"><input id="' + f + '" class="field" name="' + f + '" type="file"></div>';
                    fieldsHtml += '        <div id="' + f + '-upload-status"></div>';
                    break;
                }
                fieldsHtml += '      </li>';
            }
        }
        // Buttons
        var buttonsHtml = "";
        for (b in map.buttons) {
            var button = map.buttons[b];
            buttonsHtml += '      <li>';
            //buttonsHtml += '        <input id="' + b + '" class="submit" value="' + button.title + '">';
            buttonsHtml += GLUE.UI.WIDGET.renderButton({ buttonId: b, title: button.title });
            buttonsHtml += '      </li>';
        }
        // Open form
        text += '<form class="forms" id="' + map.formId + '"';
        if (uploadForm) { 
            map.method = "post";
            text += ' enctype="multipart/form-data" target="' + uploadIframeId + '"';
        }
        text += ' method="' + map.method + '" action="' + map.action + '">';
        // Fields and buttons
        text += '  <fieldset>';
        text += '    <ul>';
        text += fieldsHtml;
        text += buttonsHtml;
        text += '    </ul>';
        text += '  </fieldset>';
        // Close form
        text += '</form>';
        // Generate iframe for file uploads?
        if (uploadForm) {
            text += '<iframe id="' + uploadIframeId + '" name="" src="#" style="display: none;">';
            text += '</iframe>';
        }
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
            // Add button action(s)
            for (b in map.buttons) {
                var button = map.buttons[b];
                jQuery("#" + b).click(button.action);
            }
        } else {
            return text;
        }
    },

}
