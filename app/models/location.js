import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
    disposition: attr("string"),
    exposure: attr("string"),
    domain: attr("string"),
    lat: attr("number"),
    lon: attr("number"),
    feed: belongsTo("feed")
});
