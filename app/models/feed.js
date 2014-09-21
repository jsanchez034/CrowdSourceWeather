import DS from 'ember-data';

var attr = DS.attr,
    hasMany = DS.hasMany;

export default DS.Model.extend({
    feed: attr("string"),
    title: attr("string"),
    description: attr("string"),
    status: attr("string"),
    version: attr("string"),
    creator: attr("string"),
    updated: attr("date"),
    created: attr("date"),
    tags: attr("array"),
    location: attr(),
    datastreams: hasMany("datastream", {async: false})

});
