/////////////////////////////////////
// Reveal dependencies configuration
/////////////////////////////////////

Reveal.configure(
	{
    external: {
      async: false // synchroneous loading of httprequest deprecated
    },

  reveald3: {
      mapPath: 'content/',
      tryFallbackURL: true,
    },

    menu: {
      path: 'lib/css', // where the menu.css will be found
      // Specifies which side of the presentation the menu will
      // be shown. Use 'left' or 'right'.
      side: 'left',
      // Add slide numbers to the titles in the slide list.
      // Use 'true' or format string (same as reveal.js slide numbers)
      numbers: true,
      // Specifies which slide elements will be used for generating
      // the slide titles in the menu. The default selects the first
      // heading element found in the slide, but you can specify any
      // valid css selector and the text from the first matching
      // element will be used.
      // Note: that a section data-menu-title attribute or an element
      // with a menu-title class will take precedence over this option
      titleSelector: 'h1, h2, h3, h4, h5, h6',
      // Hide slides from the menu that do not have a title.
      // Set to 'true' to only list slides with titles.
      hideMissingTitles: false,
      // Add markers to the slide titles to indicate the
      // progress through the presentation
      markers: true,
      // Specify custom panels to be included in the menu, by
      // providing an array of objects with 'title', 'icon'
      // properties, and either a 'src' or 'content' property.
      custom: false,
      // Specifies the themes that will be available in the themes
      // menu panel. Set to 'false' to hide themes panel.
      themes: false,
      // Specifies if the transitions menu panel will be shown.
      transitions: true,
      // Adds a menu button to the slides to open the menu panel.
      // Set to 'false' to hide the button.
      openButton: true,
      // If 'true' allows the slide number in the presentation to
      // open the menu panel. The reveal.js slideNumber option must
      // be displayed for this to take effect
      openSlideNumber: false,
      // If true allows the user to open and navigate the menu using
      // the keyboard. Standard keyboard interaction with reveal
      // will be disabled while the menu is open.
      keyboard: true,
      // By default the menu will load it's own font-awesome library
      // icons. If your presentation needs to load a different
      // font-awesome library the 'loadIcons' option can be set to false
      // and the menu will not attempt to load the font-awesome library.
      loadIcons: false
    },
  }
)
