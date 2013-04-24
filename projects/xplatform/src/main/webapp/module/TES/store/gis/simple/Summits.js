/**
 * The store used for summits
 */
Ext.define('TES.store.gis.simple.Summits', {
    extend: 'GeoExt.data.FeatureStore',
    model: 'TES.model.gis.simple.Summit',
    autoLoad: false
});
