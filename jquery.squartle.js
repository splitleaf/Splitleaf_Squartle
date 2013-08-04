/**
 * Splitleaf_Squartle
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the MIT LICENSE
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/MIT
 *
 * @category   Splitleaf
 * @package    Splitleaf_Squartle
 * @copyright  Copyright 2013 Splitleaf, LLC
 * @license    http://opensource.org/licenses/MIT
 * @author     Sean Kennedy <sean@splitleaf.net>
 * @version    1.0.0
 */
;(function ($, window, document, undefined) {
    
    // Defaults
    var pluginName = "squartle";
    // overrideable defaults
    var defaults = {
        containerClass: "squartle-container",
        heroContainerClass: "squartle-heroes",
        heroEnable: true,
        heroClass: "squartle-hero",
        heroDefault: 0,
        linkClass: "squartle-link",
        listClass: "squartle-items",
        itemClass: "squartle-item",
        imageClass: "squartle-image",
        imageHoverClass: "squartle-image-hover",
        itemsAcross: '3'
    };

    // plugin constructor
    function Squartle(element, options) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Squartle.prototype = {
        init: function() {
            this._setupOptions(this.element, this.options);
            this._setupElements(this.element, this.options);
            this._setupStyles(this.element, this.options);
            this._setupHover(this.element, this.options);
            this._setupClick(this.element, this.options);
        },

        _setupOptions: function(element, options) {
            this.options.hasHeroes = $('> ul > li > div', element).length?true:false;
        },

        _setupElements: function(element, options) {
            // add hover images
            $('> ul > li img', element).each(function(){
                // Image class
                $(this).addClass(options.imageClass);
                // Link class
                $(this).parentsUntil(element, 'a').addClass(options.linkClass);
                // Item class
                $(this).parentsUntil(element, 'li').addClass(options.itemClass);
                // List class
                $(this).parentsUntil(element, 'ul').addClass(options.listClass);
                if ($(this).data('hover')) {
                    hover = $('<img>')
                        .attr({
                            'src': $(this).data('hover'),
                            'alt': $(this).attr('alt')
                        })
                        .addClass(options.imageHoverClass);
                    $($(this).parent()).append(hover);        
                }
            });
            // hero container if we need it
            if (options.hasHeroes) {
                heroesContainer = $('<div>')
                    .addClass(options.heroContainerClass)
                $(element).prepend(heroesContainer);
                // move heroes in to the container
                $('li', element).each(function(){
                    heroes = $('> div', this).addClass(options.heroClass);
                    //heroes.children().wrapAll('<div class="inner">');
                    $('> div', element).append(heroes);
                });
            }
        },

        _setupStyles: function(element, options) {
            // container
            $(element).css({
                'max-width': '100%',
                overflow: 'hidden',
                width: '100%'
            });
            // heroes
            $('.'+options.heroContainerClass, element).css({
                position: 'relative',
                height: '0',
                overflow: 'hidden'
            });
            $('.'+options.heroClass, element).css({
                position: 'absolute',
                height: 'auto',
                top: '0',
                left: '0',
                'z-index': 0,
                opacity: 0
            });
            // list
            $('.'+options.listClass).css('display', 'inline');
            // items
            width = 100/options.itemsAcross;
            $('.'+options.itemClass, element).css({
                overflow: 'hidden',
                float: 'left',
                display: 'block',
                position: 'relative',
                width: width+'%'
            });
            // links
            $('.'+options.linkClass).css('display', 'inline');
            // images
            $('.'+options.imageClass, element).css({
                display: 'block',
                height: 'auto',
                'max-width': '100%',
                width: '100%'
            });
            $('.'+options.imageHoverClass, element).css({
                display: 'none',
                height: 'auto',
                'max-width': '100%',
                width: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                'z-index': '10'
            });
        },

        _setupHover: function(element, options) {
            if ($('.'+options.linkClass, element).length) {
                $('.'+options.linkClass, element).each(function(){
                    $(this).hover(function(e){
                        e.preventDefault();
                        if (!$(this).hasClass('active'))
                            $('> .'+options.imageHoverClass, this).finish().fadeIn('fast');
                    },
                    function(e){
                        e.preventDefault();
                        if (!$(this).hasClass('active'))
                            $('> .'+options.imageHoverClass, this).finish().fadeOut('fast');
                    });
                });
            }
        },

        _setupClick: function(element, options) {
            $('.'+options.linkClass, element).click(function(e){
                e.preventDefault();
                // hide others
                notActive = $('> a', $(this).parent().siblings().not($(this).parent()));
                notActive.removeClass('active');
                $('> .'+options.imageHoverClass, notActive).finish().fadeOut('fast');
                // activate
                $(this).addClass('active');
                $('> .'+options.imageHoverClass, this).finish().fadeIn('fast');
                // show hero if needed
                if (options.hasHeroes) {
                    // elements
                    hero = $('.'+options.heroClass, element).get($(this).parent().index());
                    heroAll = $('.'+options.heroClass, element);
                    heroNotActive = $('.'+options.heroClass, element).not(hero);
                    $(heroAll).animate({'z-index': 0, opacity: 0}, { duration: 'fast', queue: false });
                    $(hero).animate({'z-index': 10, opacity: 1}, { duration: 'fast', queue: false });
                    $('.'+options.heroContainerClass, element).animate({
                        height: $(hero).height()
                    }, { duration: 'fast', queue: false });
                }
            });
        }
    };

    // plugin wrapper
    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Squartle( this, options ));
            }
        });
    };

})(jQuery, window, document);