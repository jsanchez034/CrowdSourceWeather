import Ember from 'ember';

export default Ember.Component.extend({
    height: "400px",
    width: null,

    map: null,
    marker: null,
    circle: null,

    radius: null,
    latitude: null,
    longitude: null,

    plotPoints: null,
    selectedNode: null,
    _currentMarkers: [],

    updateCircleRadius: function(map, center, radius) {
        var circle = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.25,
            map: map,
            center: center,
            radius: (radius | 0) * 1000
        };

        this.set("circle", new google.maps.Circle(circle)) ;

    },

    didInsertElement: function() {
        var center = new google.maps.LatLng(this.get("latitude"),this.get("longitude")),
            options = {
                disableDefaultUI: true,
                center: center,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            _height = this.get("height") || "100%",
            _width = this.get("width") || "100%",
            radius = this.get("radius"),
            map,
            marker;

        // this is required for the map to be rendered
        this.$(".map").css({ width: _width, height: _height });

        // create the map and main marker
        map = new google.maps.Map(this.$(".map")[0], options);
        marker = new google.maps.Marker({ position: center, map: map, draggable: true });

        this._setMainMarkerEvents(marker);

        // save them both for later use
        this.setProperties({
            map: map,
            marker: marker
        });

        if (radius) {
            this.updateCircleRadius(map, center, radius);
        }

        this.plotPointsChanged();
    },

    willDestroyElement: function() {
        // make sure we clear all listeners
        this._clearMarkerEvents(this.get("marker"));
    },

    positionUpdated: function() {
        this.sendAction("locationChanged", this.get("latitude"), this.get("longitude"), this.get("radius"));
    },

    clearMarkers: function() {
        var markers = this.get("_currentMarkers"),
            currentMarker;

        for (var i = 0; i < markers.length; i++) {
            currentMarker = markers[i];
            this._clearMarkerEvents(currentMarker);
            currentMarker.setMap(null);
        }

        this.get("circle").setMap(null);
        this.set("_currentMarkers", []);
    },

    defualtPointIcon: {
        path: 'M0 -27.575q0 -5.22 2.916 -9.9 0.216 -0.324 2.25 -3.258t3.636 -5.436 3.582 -6.408 2.988 -7.254q0.324 -1.08 1.224 -1.692t1.836 -0.612 1.854 0.612 1.206 1.692q1.008 3.348 2.988 7.254t3.582 6.408 3.636 5.436 2.25 3.258q2.916 4.572 2.916 9.9 0 7.632 -5.4 13.032t-13.032 5.4 -13.032 -5.4 -5.4 -13.032zm9.216 4.608q0 1.908 1.35 3.258t3.258 1.35 3.258 -1.35 1.35 -3.258q0 -1.296 -0.72 -2.484 -0.036 -0.036 -0.558 -0.81t-0.918 -1.368 -0.9 -1.584 -0.756 -1.818q-0.144 -0.576 -0.756 -0.576t-0.756 0.576q-0.252 0.828 -0.756 1.818t-0.9 1.584 -0.918 1.368 -0.558 0.81q-0.72 1.188 -0.72 2.484z',
        fillColor: 'orange',
        fillOpacity: 1,
        scale: 0.45,
        strokeColor: 'red',
        strokeWeight: 1.5
    },

    selectedPointIcon: {
        path: 'M0 -27.575q0 -5.22 2.916 -9.9 0.216 -0.324 2.25 -3.258t3.636 -5.436 3.582 -6.408 2.988 -7.254q0.324 -1.08 1.224 -1.692t1.836 -0.612 1.854 0.612 1.206 1.692q1.008 3.348 2.988 7.254t3.582 6.408 3.636 5.436 2.25 3.258q2.916 4.572 2.916 9.9 0 7.632 -5.4 13.032t-13.032 5.4 -13.032 -5.4 -5.4 -13.032zm9.216 4.608q0 1.908 1.35 3.258t3.258 1.35 3.258 -1.35 1.35 -3.258q0 -1.296 -0.72 -2.484 -0.036 -0.036 -0.558 -0.81t-0.918 -1.368 -0.9 -1.584 -0.756 -1.818q-0.144 -0.576 -0.756 -0.576t-0.756 0.576q-0.252 0.828 -0.756 1.818t-0.9 1.584 -0.918 1.368 -0.558 0.81q-0.72 1.188 -0.72 2.484z',
        fillColor: 'red',
        fillOpacity: 1,
        scale: 0.45,
        strokeColor: 'orange',
        strokeWeight: 1.5
    },

    plotPointsChanged: function() {
        var gmap = this.get("map"),
            plotPoints = this.get("plotPoints"),
            i = 0,
            len = plotPoints.length,
            currentPlotPoint,
            currentGoogleMarker;

        for(;i < len;i++) {
            currentPlotPoint = plotPoints[i];

            currentGoogleMarker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                icon: this.defualtPointIcon,
                position: new google.maps.LatLng(currentPlotPoint.lat, currentPlotPoint.lon),
                map: gmap
            });

            this._setPlotPointEvents(currentGoogleMarker, currentPlotPoint.modelId);
            this.get("_currentMarkers").pushObject(currentGoogleMarker);
        }

    }.observes("plotPoints.@each"),

    selectedNodeObs: function() {
        var map = this.get("map"),
            nodeLocation = this.get("selectedNode.location"),
            latLng = new google.maps.LatLng(nodeLocation.lat, nodeLocation.lon),
            marker = this.get("_currentMarkers").find(function(item) {
                return item.getPosition().equals(latLng);
            });

        this._resetPointIcons();
        marker.setIcon(this.selectedPointIcon);

        $('html, body').animate({
            scrollTop: this.$().offset().top - 5
        }, 500);

        map.setCenter(latLng);
        map.setZoom(14);

        latLng = null;

    }.observes("selectedNode"),

    _setMainMarkerEvents: function(marker) {
        var self = this;

        // add a listener on the "drag" event of the marker
        google.maps.event.addListener(marker, "drag", function() {
            Ember.run(function() {
                // retrieve the current position of the marker
                var position = marker.getPosition();
                // update the latitude/longitude properties
                self.setProperties({
                    latitude: position.lat(),
                    longitude: position.lng()
                });

            });
        });

        google.maps.event.addListener(marker, "dragend", function() {
            Ember.run(function() {
                var newCenter = new google.maps.LatLng(self.get("latitude"), self.get("longitude")),
                    map = self.get("map");

                //clear individual node markers
                self.clearMarkers();

                //set new center and update the circle wrapping
                //individual node markers
                map.setCenter(newCenter);
                map.setZoom(8);
                self.updateCircleRadius(map, newCenter, self.get("radius"));

                //send Action outside component notifying lat/lon change
                self.positionUpdated();
            });
        });

    },

    _setPlotPointEvents: function(marker, modelid) {
        var self = this;

        google.maps.event.addListener(marker, "click", function() {
            Ember.run(function() {
                self._resetPointIcons();
                marker.setIcon(self.selectedPointIcon);
                self.sendAction("markerSelected", modelid);
            });
        });

    },

    _resetPointIcons: function() {
        var allPlottedMarkers = this.get("_currentMarkers"),
            len = allPlottedMarkers.length,
            i = 0;

        for(; i < len; i++) {
            allPlottedMarkers[i].setIcon(this.defualtPointIcon);
        }

    },

    _clearMarkerEvents: function(marker) {
        google.maps.event.clearInstanceListeners(marker);
    }
});
