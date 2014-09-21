import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {

    attrs: {
        datastreams: {embedded: 'always'}
    },
    keyForAttribute: function(attr) {
        return Ember.String.camelize(attr);
    },
    keyForRelationship: function(key) {
        return "rel_" + key;
    },

    extractArray: function(store, type, payload) {
        payload["feeds"] = payload.results;
        delete payload.results;

        return this._super(store, type, payload);
    },
    extractMeta: function(store, type, payload) {
        var metaAttributes = this.get("_metaToExtract"),
            i = 0,
            len = metaAttributes.length;

        for(;i < len;i++) {
            this._setMeta(metaAttributes[i], store, type, payload);
        }
    },
    _metaToExtract: ["totalResults","itemsPerPage", "startIndex"],
    _setMeta: function(metta_attribute, store, type, payload) {
        var metavalue = payload[metta_attribute],
            meta;
        if (payload && metavalue !== undefined) {
            meta = {};
            meta[metta_attribute] = metavalue;
            store.metaForType(type, meta);
            delete payload[metta_attribute];
        }
    }
});
