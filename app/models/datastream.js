import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
    currentValue: attr("number"),
    at: attr("date"),
    maxValue: attr("string"),
    minValue: attr("number"),
    tags: attr("array"),
    unit: attr()
});
