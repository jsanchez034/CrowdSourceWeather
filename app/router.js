import Ember from 'ember';

var Router = Ember.Router.extend({
    location: MapAppENV.locationType
});

Router.map(function() {
    this.route('humidity', { path: '/humidity/:lat/:lon/:radius' } );
});

export default Router;