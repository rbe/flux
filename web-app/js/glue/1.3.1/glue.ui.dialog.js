/*
 * Dialog API.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.UI.DIALOG = {
    
    /*
     * Standard dialog options.
     */
    standardDialogOptions: {
        autoOpen: false,
        bgiframe: true,
        resizable: false,
        modal: true,
        overlay: {
            backgroundColor: '#000',
            opacity: 0.5
        },
    },
    
    /*
     * Render a dialog: add div for dialog and actions to show it.
     * @param map A map:
     *            dialogId
     *            dialogOptions: map with options: autoOpen: bool, width: int, bgiframe: bool, modal: bool, overlay: map=backgroundColor, opacity
     *            dialogButtons: map with key=label value=action/a function
     *            linkId: id of link which 'onClick' shows dialog
     */
    renderDialog: function(map) {
        // Check map
        // Selector for dialog
        var dialogSel = '#' + map.dialogId;
        // Create dialog div
        var text = "";
        text += '<div id="' + map.dialogId + '" title="' + map.title + '">';
        text += '<p>';
        text += '<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>';
	text += map.content;
        text += '</p>'
        text += '</div>';
        // Set text at...
        if (map.placement) {
            // Set dialog-div at end of body tag
            ////if (!map.placement.after) map.placement.after = "body";
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement); //jQuery("body").append(text);
            // Activate dialog and add dialog actions
            jQuery(dialogSel).dialog({
	        autoOpen: map.dialogOptions.autoOpen,
	        width: map.dialogOptions.width,
	        bgiframe: map.dialogOptions.bgiframe,
	        modal: map.dialogOptions.modal,
	        buttons: map.dialogButtons
            });
            // Add click listener
            if (map.linkId) this.tieLinkToDialog(map);
        } else {
            return text;
        }
    },
    
    /*
     * Tie a link to a dialog: open dialog when link is clicked.
     * @param map A map:
     *            dialogId: the id attribute of the dialog's div.
     *            linkId: the id attribute of the link.
     */
    tieLinkToDialog: function(map) {
        // Check map
        // Selectors
        var linkSel = '#' + map.linkId;
        var dialogSel = '#' + map.dialogId;
        // Execute function to show dialog 'onClick'
        jQuery(linkSel).click(function(event) {
	    jQuery(dialogSel).dialog('open');
	    return false;
        });
    },
    
}
