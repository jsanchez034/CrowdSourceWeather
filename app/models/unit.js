import DS from 'ember-data';

var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
    symbol: attr("string"),
    label: attr("string"),
    datastream: belongsTo("datastream")
});
