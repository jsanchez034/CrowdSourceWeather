import DS from 'ember-data';

//'https://api.xively.com/'
export default DS.RESTAdapter.extend({
    namespace: 'v2',
    host: 'http://localhost:4200',
    headers: {
        "X-ApiKey": "TvtHeLkibFVnaKBu4zQxgbQHv4iSAKxydDlEUDBTa0lQZz0g"
    }
});
