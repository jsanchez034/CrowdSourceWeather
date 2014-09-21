import Ember from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized;
  },

  serialize: function(deserialized) {
    return Ember.typeOf(deserialized) === 'array' ? deserialized : [];
  }
});
