import Ember from 'ember';
/* global moment */

function dateFromNow(value) {
  return moment(value).fromNow();
}

export { dateFromNow };

export default Ember.Handlebars.makeBoundHelper(dateFromNow);
