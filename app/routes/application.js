import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        loading: function() {
            var view = this.container.lookup('view:loading').append();
            this.router.one('didTransition', view, 'destroy');
        }
    }
});
