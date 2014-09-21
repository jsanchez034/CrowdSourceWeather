import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        var lat = params.lat,
            lon = params.lon,
            radius = params.radius;

        this.controllerFor("humidity").setProperties({
            lat: lat,
            lon: lon,
            radius: radius
        });

        return this.store.find("feed", { lat: lat, lon: lon , status: "live", distance: radius, q: "humidity"});
    },

    actions: {
        changeLocation: function(lat, lon, radius) {
            radius = radius || 100;
            this.transitionTo("humidity", lat, lon, radius);
        }
    }
});
