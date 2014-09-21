import Ember from 'ember';

export default Ember.ArrayController.extend({
    itemController: "humidityFeed",
    sorting: ['humiditPercentageValue:desc'],
    sortedContent: Ember.computed.sort('@this', 'sorting'),
    lat: null,
    lon: null,
    radius: null,
    mapPoints: function() {
        return this.get("content").map(function(feed) {
            var location = feed.get("location");
            return {lat: location.lat, lon: location.lon, modelId: feed.id};
        });
    }.property("content"),

    selectedFeed: null,

    actions: {
        selectFeed: function(feed) {
            this.setEach("isSelected", false);
            feed.set("isSelected", true);
            this.set("selectedFeed", feed);
        },
        markerSelect: function(feedid) {
            var feed = this.findBy("id", feedid),
                $feedElem = $('#' + feedid);

            this.setEach("isSelected", false);
            feed.set("isSelected", true);

            $('html, body').animate({
                scrollTop: $feedElem.offset().top - 5
            }, 500);
        }
    }
});
