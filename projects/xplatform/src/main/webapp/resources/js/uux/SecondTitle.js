/**
 * Ext.ux.secondTitle
 *
 * @class       Ext.ux.SecondTitle
 * @extends     Ext.AbstractPlugin
 *
 * @author      René Bartholomay
 * @copyright   (c)2012, René Bartholomay
 * @version     1.0.3
 * @date        2012/03/07
 *
 *
 * you must include some css for nicer look :-)
 *
 *      .x-window .ux-second-title-cnt .x-window-header-text-container a,
 *      .x-panel .ux-second-title-cnt .x-panel-header-text-container a,
 *      .x-tab em.ux-second-title-cnt a{
 *          text-decoration : none;
 *          white-space:nowrap;
 *      }
 *
 *      .x-window .ux-second-title-cnt .x-window-header-text-container a:hover,
 *      .x-panel .ux-second-title-cnt .x-panel-header-text-container a:hover,
 *      .x-tab em.ux-second-title-cnt a:hover{
 *          text-decoration : underline;
 *      }
 *
 *
 *      .x-window .ux-second-title-cnt .x-window-header-text,
 *      .x-tab em.ux-second-title-cnt button .x-tab-inner {
 *          display: inline;
 *      }
 *
 *      span.ux-second-title {
 *          color           : #990000;
 *          cursor          : pointer;
 *          margin          : 0 0 0 4px;
 *          font-weight     : bold;
 *          font-size       : 11px;
 *          text-shadow     : 1px 1px 0 #FFFFFF;
 *      }
 *
 *  After including the plugin the Ext.tab.Panel and Ext.panel.Panel have
 *  two new events: secondtitleclick, secondtitlechange
 *
 *  and new functions:  setSecondTitle(), getSecondTitle() and clearSecondTitle()
 *  zhang
 *  http://www.sencha.com/forum/showthread.php?135272-Ext.ux.SecondTitle
 *  I have changed this
 */

Ext.define('Ext.ux.SecondTitleHeader', {
    extend  : "Ext.panel.Header",
    alias   : 'widget.secondtitleheader',

    headingTpl  :   
                    '<span id="{id}-textEl" class="{cls}-text {cls}-text-{ui}">{title}</span>'+
                    '<a id="{id}-secondTitleEl" href="#" role="link" >'+
                    '<span id="{id}-secondTitleInnerEl" class="{baseCls}-inner ux-second-title" style="margin-left:0;margin-right:4px">' +
                            '<tpl if="secondTitle">{sTitleBefore}{secondTitle}{sTitleAfter}</tpl>' +
                        '</span>' +
                    '</a>',


    initComponent: function() {
        var me = this,
            ruleStyle,
            rule,
            style,
            ui;

        me.indicateDragCls = me.baseCls + '-draggable';
        me.title = me.title || ' ';
        me.tools = me.tools || [];
        me.items = me.items || [];
        me.orientation = me.orientation || 'horizontal';
        me.dock = (me.dock) ? me.dock : (me.orientation == 'horizontal') ? 'top' : 'left';

        //add the dock as a ui
        //this is so we support top/right/left/bottom headers
        me.addClsWithUI([me.orientation, me.dock]);

        if (me.indicateDrag) {
            me.addCls(me.indicateDragCls);
        }

        // Add Icon
        if (!Ext.isEmpty(me.iconCls) || !Ext.isEmpty(me.icon)) {
            me.initIconCmp();
            me.items.push(me.iconCmp);
        }

        // Add Title
        if (me.orientation == 'vertical') {
            me.layout = {
                type : 'vbox',
                align: 'center'
            };
            me.textConfig = {
                width: 15,
                cls: me.baseCls + '-text',
                type: 'text',
                text: me.title,
                rotate: {
                    degrees: 90
                }
            };
            ui = me.ui;
            if (Ext.isArray(ui)) {
                ui = ui[0];
            }
            ruleStyle = '.' + me.baseCls + '-text-' + ui;
            if (Ext.scopeResetCSS) {
                ruleStyle = '.' + Ext.baseCSSPrefix + 'reset ' + ruleStyle;
            }
            rule = Ext.util.CSS.getRule(ruleStyle);
            if (rule) {
                style = rule.style;
            }
            if (style) {
                Ext.apply(me.textConfig, {
                    'font-family': style.fontFamily,
                    'font-weight': style.fontWeight,
                    'font-size': style.fontSize,
                    fill: style.color
                });
            }
            me.titleCmp = new Ext.draw.Component({
                width     : 15,
                ariaRole  : 'heading',
                focusable : false,
                viewBox   : false,
                flex      : 1,
                id        : me.id + '_hd',
                autoSize  : true,
                margins   : '5 0 0 0',
                items     : [ me.textConfig ],
                xhooks: {
                    setSize: function (width) {
                        // don't pass 2nd arg (height) on to setSize or we break 'flex:1'
                        this.callParent([width]);
                    }
                },
                // this is a bit of a cheat: we are not selecting an element of titleCmp
                // but rather of titleCmp.items[0]
                childEls  : [
                    { name: 'textEl', select: '.' + me.baseCls + '-text' }
                ]
            });
        } else {
            me.layout = {
                type : 'hbox',
                align: 'middle'
            };
            me.titleCmp = new Ext.Component({
                height    : 15,
                xtype     : 'component',
                ariaRole  : 'heading',
                focusable : false,
                noWrap    : true,
                flex      : 1,
                id        : me.id + '_hd',
                cls       : me.baseCls + '-text-container',
                renderTpl : me.getTpl('headingTpl'),
                renderData: {
                    title       : me.title,
                    cls         : me.baseCls,
                    ui          : me.ui,
                    secondTitle : me.secondTitle,
                    sTitleBefore: me.sTitleBefore,
                    sTitleAfter : me.sTitleAfter
                },
                childEls  : ['textEl', 'secondTitleEl', 'secondTitleInnerEl']
            });
        }
        me.items.push(me.titleCmp);

        // Add Tools
        me.items = me.items.concat(me.tools);

        Ext.container.Container.superclass.initComponent.call(this);

        me.on({
            click: me.onClick,
            element: 'el',
            scope: me
        });
    }
});


Ext.define('Ext.ux.SecondTitle', {
    extend  : "Ext.AbstractPlugin",
    alias   : 'plugin.ux.secondtitle',

    secondTitle : '',

    sTitleBefore: '',

    sTitleAfter : '',

    /**
     * this is a modified button template
     */
    tabTpl      : [
                    '<em id="{id}-btnWrap" class="ux-second-title-cnt <tpl if="splitCls"> {splitCls}</tpl>">',
                        '<tpl if="href">',
                            '<a id="{id}-btnEl" href="{href}" class="{btnCls}" target="{hrefTarget}"<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="link">',
                                '<span id="{id}-btnInnerEl" class="{baseCls}-inner">',
                                    '{text}',
                                '</span>',
                                '<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}"<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>></span>',
                            '</a>',
                        '<tpl else>',
                            '<button id="{id}-btnEl" type="{type}" class="{btnCls}" hidefocus="true"',
                                // the autocomplete="off" is required to prevent Firefox from remembering
                                // the button's disabled state between page reloads.
                                '<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl> role="button" autocomplete="off">',
                                '<span id="{id}-btnInnerEl" class="{baseCls}-inner" style="{innerSpanStyle}">',
                                    '{text}',
                                '</span>',
                                '<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}"<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>> </span>',
                            '</button>',
                            '<a id="{id}-secondTitleEl" href="#" role="link" >' +
                                '<span id="{id}-secondTitleInnerEl" class="{baseCls}-inner ux-second-title">' +
                                    '<tpl if="secondTitle">{sTitleBefore}{secondTitle}{sTitleAfter}</tpl>' +
                                '</span>' +
                            '</a>' +
                        '</tpl>',
                    '</em>',
                    '<tpl if="closable">',
                        '<a id="{id}-closeEl" href="#" class="{baseCls}-close-btn" title="{closeText}"></a>',
                    '</tpl>'
                ],

    headingTpl  :   '<span id="{id}-textEl" class="{cls}-text {cls}-text-{ui}">{title}</span>' +
                    '<a id="{id}-secondTitleEl" href="#" role="link" >' +
                        '<span id="{id}-secondTitleInnerEl" class="{baseCls}-inner ux-second-title">' +
                            '<tpl if="secondTitle">{sTitleBefore}{secondTitle}{sTitleAfter}</tpl>' +
                        '</span>' +
                    '</a>',

    /**
     *
     * @param config
     */
    constructor: function(config) {
        config = config || {};
        Ext.apply(this, config);
    },

    /**
     *
     * @param cmp
     */
    init : function(cmp){
        var me = this;

        // add events
        cmp.addEvents({

            /**
             * @event secondtitleclick  When the counter element is clicked
             * @param {Ext.Component} this
             * @param {String} title
             */
            secondtitleclick    : true,

            /**
             * @event secondtitlechange  When the second title is changed
             * @param {Ext.Component} this
             * @param {String} title
             */
            secondtitlechange   : true
        });



        Ext.apply(cmp, {
            secondTitle         : me.secondTitle,
            sTitleBefore        : me.sTitleBefore,
            sTitleAfter         : me.sTitleAfter,
            setSecondTitle      : me.setSecondTitle,
            getSecondTitle      : me.getSecondTitle,
            clearSecondTitle    : me.clearSecondTitle,
            onSecondTitleChange : me.onSecondTitleChange,
            onSecondTitleClick  : me.onSecondTitleClick,
            addClickListener    : me.addClickListener
        });

        // using a tabpanel?
        if (cmp.isXType('tabpanel')){
            Ext.apply(cmp, {
                tabConfig           : {
                    childEls: [
                        'secondTitleEl', 'secondTitleInnerEl', 'btnEl', 'btnWrap', 'btnInnerEl', 'btnIconEl'
                    ],
                    renderTpl   : me.tabTpl,
                    renderData  : {
                        secondTitle : me.secondTitle,
                        sTitleBefore: me.sTitleBefore,
                        sTitleAfter : me.sTitleAfter
                    }
                }
            });

            // add click listener on the secondTitleEl
            cmp.on('afterlayout', cmp.addClickListener, me, {single: true});
            cmp.on('secondtitlechange', me.onSecondTitleChange);

            cmp.onAdd = Ext.Function.createSequence(me.onAdd, cmp.onAdd, cmp);
        } else {
            if (cmp.isXType('panel')){
                cmp.updateHeader = me.updateHeader;
            }
        }
    },

    /**
     *
     * @param card
     * @param index
     */
    onAdd: function(card, index) {
        var me  = this;

        Ext.apply(card, {
            secondTitle         : me.secondTitle,
            sTitleBefore        : me.sTitleBefore,
            sTitleAfter         : me.sTitleAfter,
            tabConfig           : {
                childEls    : me.tabConfig.childEls,
                renderTpl   : me.tabConfig.renderTpl
                /* removed...
                renderData  : {
                    secondTitle : me.secondTitle,
                    sTitleBefore: me.sTitleBefore,
                    sTitleAfter : me.sTitleAfter
                }
                */
            },
            setSecondTitle      : me.setSecondTitle,
            getSecondTitle      : me.getSecondTitle,
            clearSecondTitle    : me.clearSecondTitle,
            onSecondTitleChange : me.onSecondTitleChange,
            onSecondTitleClick  : me.onSecondTitleClick,
            addClickListener    : me.addClickListener
        });

        card.on('secondtitlechange', me.onSecondTitleChange, card);
        card.on('afterlayout', me.addClickListener, card, {single: true});
    },


    /**
     * Create, hide, or show the header component as appropriate based on the current config.
     * @private
     * @param {Boolean} force True to force the header to be created
     */
    updateHeader: function(force) {
        var me = this,
            header = me.header,
            title = me.title,
            tools = me.tools;

        if (!me.preventHeader && (force || title || (tools && tools.length))) {
            if (!header) {
                header = me.header = Ext.create('Ext.ux.SecondTitleHeader', {
                    title       : title,
                    secondTitle : me.secondTitle,
                    sTitleBefore: me.sTitleBefore,
                    sTitleAfter : me.sTitleAfter,
                    orientation : (me.headerPosition == 'left' || me.headerPosition == 'right') ? 'vertical' : 'horizontal',
                    dock        : me.headerPosition || 'top',
                    textCls     : me.headerTextCls,
                    iconCls     : me.iconCls,
                    baseCls     : me.baseCls + '-header',
                    cls         : 'ux-second-title-cnt',
                    tools       : tools,
                    ui          : me.ui,
                    indicateDrag: me.draggable,
                    border      : me.border,
                    frame       : me.frame && me.frameHeader,
                    ignoreParentFrame : me.frame || me.overlapHeader,
                    ignoreBorderManagement: me.frame || me.ignoreHeaderBorderManagement,
                    listeners   : me.collapsible && me.titleCollapse ? {
                        click: me.toggleCollapse,
                        scope: me
                    } : null
                });
                me.addDocked(header, 0);

                // Reference the Header's tool array.
                // Header injects named references.
                me.tools = header.tools;

                me.header.titleCmp.on({
                    click   : me.onSecondTitleClick,
                    element : 'secondTitleEl',
                    scope   : me
                });
            }
            header.show();
            me.initHeaderAria();
        } else if (header) {
            header.hide();
        }
    },

    /**
     * Set the second title with a new value
     * @param t
     */
    setSecondTitle : function(t){
        var me = this,
            title = (t) ? this.sTitleBefore + t + this.sTitleAfter : '',
            oldTitle = me.secondTitle;

        me.secondTitle = title;

        if (me.header) {
            me.header.titleCmp.secondTitleInnerEl.update(title);
        }

        me.fireEvent('secondtitlechange', this, t, oldTitle);
    },


    /**
     * get the second title
     * @return {String}
     */
    getSecondTitle : function(){
        return this.secondTitle;
    },

    /**
     * Clears the second title
     * @return {String}
     */
    clearSecondTitle : function(){
        return this.setSecondTitle('');
    },

    /**
     * Fire an event in the scope of the component
     * @param e
     * @private
     */
    onSecondTitleClick : function(e){
        e.preventDefault();

        this.fireEvent('secondtitleclick', this, this.secondTitle);
    },

    /**
     *
     * @param cmp
     * @param t
     * @param oldtitle
     */
    onSecondTitleChange: function(cmp, t, oldtitle){
        var title = (t) ? this.sTitleBefore + t + this.sTitleAfter : '';

        cmp.tab.secondTitleInnerEl.update(title);
        cmp.tab.tabBar.doLayout();
    },

    /**
     *
     * @param cmp
     */
    addClickListener : function(cmp){
        if (cmp.tab){
            cmp.tab.secondTitleEl.on('click', cmp.onSecondTitleClick, cmp);
        }
    }
}); 