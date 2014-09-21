import Ember from 'ember';

export default Ember.ObjectController.extend({

    humidityDataStream: function() {
        return this.get('model.datastreams').find(function(stream) {
            var tags = stream.get('tags');
            return tags && tags.join(',').search(/humidity/i) !== -1;
        });
    }.property('model.datastreams.[]'),

    humiditPercentage: function() {
        return +this.get('humiditPercentageValue') + "%";
    }.property('humiditPercentageValue'),

    humiditPercentageValue: function() {
        return +(this.get('humidityDataStream.currentValue') || 0).toFixed(2);
    }.property('humidityDataStream'),

    indicatorStyle: function() {
        return 'width: ' + this.get('humiditPercentage') + ";";
    }.property("humidityDataStream"),

    isSelected: false

});
