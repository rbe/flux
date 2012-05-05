/*
 * Menu API.
 * Copyright (C) 2011-2012 art of coding, http://www.art-of-coding.eu.
 */
GLUE.UI.MENU = {
    
    scripts: [
        GLUE.META.ADMINTASIA_URL + "/superfish.js",
    ],
    
    /*
     * Initialize - activate navigation menu.
     */
    init: function() {
        // Load scripts and initialize menu.
        GLUE.loadScripts(this.scripts, 0, function () {
            //
            jQuery('ul#navigation').superfish({ 
                delay:       250,
                animation:   { opacity: 'show', height: 'show' },
                speed:       'fast',
                autoArrows:  true,
                dropShadows: false
            });
            jQuery('ul#navigation li').hover(
                function() {
                    jQuery(this).addClass('sfHover2');
                },
                function(){
                    jQuery(this).removeClass('sfHover2');
                }
            );
        });
    },
    
    /*
     * Render a menu.
     * @param map A map:
     */
    renderMenu: function(map) {
        // Check map
        //
        var text = "";
        // Go through all menus
        for (m in map.menu) {
            var menu = map.menu[m];
            var menuHtml = "";
            menuHtml += '<li>';
            // A link: menu title and action
            menuHtml += '<a id="' + m + '" href="' + menu.target + '"';
            // Do we have menuitems in this menu?
            if (menu.items) {
                menuHtml += ' class="sf-with-ul"';
            }
            menuHtml += '>' + menu.title + '</a>';
            // Process menuitems
            if (menu.items) menuHtml += this.renderMenuItems(menu);
            menuHtml +='</li>';
            //
            text += menuHtml;
        }
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
            // If we wrote the menu to the document, we can attach the action
            this.setMenuActions(map.menu);
        } else {
            return text;
        }
    },
    
    /*
     * Render a list of menu items.
     * @param items A map with menu items: { menuItemId:, title:, action: }
     */
    renderMenuItems: function(map) {
        //
        var text = "";
        text += '<ul>';
        // Process menu items
        for (i in map.items) {
            var item = map.items[i];
            var menuHtml = "";
            // Render the menu item itself
            menuHtml += this.renderMenuItem(GLUE.TOOLS.merge({ menuItemId: i }, item));
            // Are there more items, a submenu?
            if (item.items) {
                // Recurse call to this function
                menuHtml += this.renderMenuItems(item);
                // Close li tag
                menuHtml += '</li>';
            }
            // Append HTML for this menu
            text += menuHtml;
        }
        text += '</ul>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
            // If we wrote the menuitem(s) to the document, we can attach the action(s)
            this.setMenuActions(map);
        } else {
            return text;
        }
    },
    
    /*
     * Render a single menu item.
     * @param map A map:
     */
    renderMenuItem: function(map) {
        // Check map
        if (!map.target) map.target = "#";
        //
        var text = "";
        text += '<li>';
        text += '<a id="' + map.menuItemId + '" href="' + map.target + '">' + map.title + '</a>';
        // Do not close li tag if there are submenu items
        if (!map.items) text += '</li>';
        // Set text at...
        if (map.placement) {
            map.placement.content = text;
            GLUE.UI.placeContent(map.placement);
            // If we wrote the menuitem to the document, we can attach the action
            this.setMenuItemAction(map);
        } else {
            return text;
        }
    },
    
    /*
     * Set the 'onClick' action for a menuitem (a tag).
     * @param map A map:
     *            menuItemId: ID of a menuitem
     *            action: a function
     */
    setMenuItemAction: function(map) {
        if (map.menuItemId && map.action) {
            var sel = "a#" + map.menuItemId;
            jQuery(sel).click(map.action);
        }
    },
    
    /*
     * Set actions for all menuitems.
     * @param map A map.
     */
    setMenuActions: function(map) {
        for (m in map) {
            // Action for menu itself
            var menu = map[m];
            var sel = "a#" + m;
            if (menu.action) jQuery(sel).click(menu.action);
            // Action(s) for the/all menu item(s)
            for (i in menu.items) {
                var item = menu.items[i];
                var item2 = GLUE.TOOLS.merge({ menuItemId: i }, item);
                this.setMenuItemAction(item2);
                if (item.items) this.setMenuActions(item);
            }
        }
    },
    
    /*
     * Render menu for theme changer.
     * @param menu Existing menu.
     */
    renderThemeChanger: function(menu) {
        /*
        GLUE.UI.MENU.renderMenu({
                                  menu: {
                                          dashboardMenu: {
                                                           title: 'Dashboard', target: '#', action: this.showOverviewPage
                                                         },
                                }
            <li>
              <a id="themeOptionsMenu" href="#" class="sf-with-ul">Theme Options</a>
                  <ul id="style-switcher">
                    <li>
                      <a class="set_theme" id="black_rose" href="#" title="Black Rose Theme" name="black_rose">Black Rose Theme</a>
                    </li>
                    <li>
                      <a class="set_theme" id="gray_standard" href="#" title="Gray Standard Theme" name="gray_standard">Gray Standard Theme</a>
                    </li>
                    <li>
                      <a class="set_theme" id="gray_lightness" href="#" title="Gray Lightness Theme" name="gray_lightness">Gray Lightness Theme</a>
                    </li>
                    <li>
                      <a class="set_theme" id="apple_pie" href="#" title="Apple Pie Theme" name="apple_pie">Apple Pie Theme</a>
                    </li>
                    <li>
                      <a class="set_theme" id="blueberry" href="#" title="Blueberry Theme" name="blueberry">Blueberry Theme</a>
                    </li>
                  </ul>
            </li>
        */
    },
    
}
