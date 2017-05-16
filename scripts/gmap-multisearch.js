/// <reference path="jquery.d.ts" /> 
/// <reference path="google.maps.d.ts" /> 
/// <reference path="markerclusterer.d.ts" />
/**
 * Class GMap
 */
var GMap = (function () {
    function GMap() {
    }
    GMap.getInstance = function () {
        if (GMap.instance == null) {
            GMap.instance = new GMap();
        }
        return GMap.instance;
    };
    GMap.prototype.update = function (map_container_class, properties, callback) {
        this.map_container_class = map_container_class;
        this.properties = properties;
        this.callback = callback;
        this.initialize(callback);
    };
    GMap.prototype.initialize = function (callback) {
        this.detachMarkers();
        this.detachMarkerClusterer();
        this.buildMapOptions();
        this.getMap().setOptions(this.getMapOptions());
        this.attachMarkers();
        if (callback != null)
            callback();
    }; //initialize 
    GMap.prototype.getMap = function () {
        if (this.map == null) {
            var mapContainer = jQuery(this.map_container_class).first();
            this.map = new google.maps.Map(mapContainer.get(0), this.getMapOptions());
        }
        return this.map;
    };
    GMap.prototype.getMapOptions = function () {
        if (this.mapOptions == null) {
            this.buildMapOptions();
        }
        return this.mapOptions;
    };
    GMap.prototype.buildMapOptions = function () {
        this.mapOptions = new Object();
        // Get defaults from data attribute 
        var mapTypeId = this.determineMapTypeId();
        this.mapOptions.navigationControl = true;
        this.mapOptions.scaleControl = true;
        this.mapOptions.center = this.determineCenterLatLng();
        this.mapOptions.mapTypeId = mapTypeId;
        if ('zoomLevel' in this.properties) {
            this.mapOptions.zoom = this.properties.zoomLevel;
        }
    };
    GMap.prototype.attachMarkers = function () {
        if ('markers' in this.properties) {
            this.attachMultipleMarkers();
        }
        else {
            if ('lat' in this.properties
                && 'lng' in this.properties
                && 'markerLabel' in this.properties) {
                this.attachSingleMarker();
            }
        }
    };
    GMap.prototype.getProperties = function () {
        return this.properties;
    };
    GMap.prototype.calcCenter = function (markers) {
        var cLat = NaN;
        var cLng = NaN;
        markers.forEach(function (element) {
            var lat = parseFloat(element.lat);
            var lng = parseFloat(element.lng);
            if (isNaN(cLat) || isNaN(cLng)) {
                cLat = lat;
                cLng = lng;
            }
            else {
                cLat = (cLat + lat) / 2;
                cLng = (cLng + lng) / 2;
            }
        });
        var result = new google.maps.LatLng(cLat, cLng);
        return result;
    };
    ;
    GMap.prototype.determineCenterLatLng = function () {
        var centerLatLng = null;
        if ('lat' in this.getProperties() && 'lng' in this.getProperties()) {
            centerLatLng = new google.maps.LatLng(this.getProperties().lat, this.getProperties().lng);
        }
        else {
            centerLatLng = this.calcCenter(this.properties.markers);
        }
        return centerLatLng;
    };
    GMap.prototype.attachMarkerClusterer = function (map, markers, options) {
        this.markerClusterer = new MarkerClusterer(map, markers, options);
    };
    GMap.prototype.detachMarkers = function () {
        if (this.markers != null && this.markers.length > 0) {
            for (var _i = 0, _a = this.markers; _i < _a.length; _i++) {
                var marker = _a[_i];
                google.maps.event.clearListeners(marker, 'click'); //may be unnecessary
                marker.setMap(null);
            }
            this.markers = null;
        }
    };
    GMap.prototype.detachMarkerClusterer = function () {
        if (this.markerClusterer != null) {
            this.markerClusterer.clearMarkers();
        }
    };
    GMap.prototype.attachSingleMarker = function () {
        var centerLatLng = this.determineCenterLatLng();
        var marker = new google.maps.Marker({
            position: centerLatLng,
            map: this.getMap()
        });
        this.markers = [marker];
        this.getMap().setCenter(centerLatLng);
        this.getMap().setZoom(this.properties.zoomLevel);
    };
    GMap.prototype.attachMultipleMarkers = function () {
        //  Create a new viewpoint bound
        //  var bounds = new google.maps.LatLngBounds();
        var self = this;
        self.markers = [];
        var infowindow = new google.maps.InfoWindow();
        this.getProperties().markers.forEach(function (element, index, array) {
            var latlng = new google.maps.LatLng(element.lat, element.lng);
            //  Fit these bounds to the map
            //    bounds.extend(latlng);
            var markerLabel = element.label;
            var title = element.title;
            var address = element.address;
            var href = element.href;
            var imgSrc = element.imgSrc;
            var city = element.city;
            var marker = new google.maps.Marker({
                position: latlng,
                map: self.getMap(),
                title: markerLabel
            });
            self.markers.push(marker);
            if (self.properties.markerTemplate) {
                var contentString = self.getProperties().markerTemplate;
                contentString = contentString.replace("{{href}}", href)
                    .replace("{{img}}", imgSrc)
                    .replace("{{title}}", title)
                    .replace("{{city}}", city)
                    .replace("{{address}}", address);
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(contentString);
                    infowindow.open(self.getMap(), marker);
                });
            }
            //     self.getMap().fitBounds(bounds);
        }); //end markers foreach
        this.attachMarkerClusterer(this.getMap(), this.markers, { imagePath: this.getProperties().imagePath });
        this.fitBounds();
    };
    GMap.prototype.fitBounds = function () {
        if (this.getProperties().zoomLevel) {
            this.getMap().setZoom(this.getProperties().zoomLevel);
        }
        else {
            var bounds = new google.maps.LatLngBounds();
            for (var _i = 0, _a = this.markers; _i < _a.length; _i++) {
                var marker = _a[_i];
                var position = marker.getPosition();
                bounds.extend(position);
            }
            this.getMap().fitBounds(bounds);
        }
    };
    GMap.prototype.determineMapTypeId = function () {
        // Get defaults from data attribute
        var mapTypeId = google.maps.MapTypeId.ROADMAP; //default
        if ("mapTypeId" in this.properties) {
            switch (this.properties.mapTypeId) {
                case "ROADMAP":
                    mapTypeId = google.maps.MapTypeId.ROADMAP;
                    break;
                case "SATELLITE":
                    mapTypeId = google.maps.MapTypeId.SATELLITE;
                    break;
                case "HYBRID":
                    mapTypeId = google.maps.MapTypeId.HYBRID;
                    break;
                case "TERRAIN":
                    mapTypeId = google.maps.MapTypeId.TERRAIN;
                    break;
            }
        }
        return mapTypeId;
    };
    return GMap;
})();
;
/**
 * GMapLoader
 */
var GMapLoader = (function () {
    function GMapLoader() {
        this.scriptsLoaded = false;
        this.properties = {};
        this.container = null;
    }
    ;
    GMapLoader.prototype.getProperties = function () {
        return this.properties;
    };
    GMapLoader.prototype.getCallback = function () {
        return this.callback;
    };
    GMapLoader.getInstance = function () {
        if (GMapLoader.instance == null) {
            GMapLoader.instance = new GMapLoader();
            GMapLoader.instance.attachScript();
        }
        return GMapLoader.instance;
    };
    ;
    GMapLoader.prototype.initDefaultContainer = function () {
        var containerId = "google-map-search-container";
        var elem = document.getElementById(containerId);
        if (!elem) {
            elem = document.createElement('div');
            elem.setAttribute('id', containerId);
            document.body.appendChild(elem);
        }
        return "#" + containerId;
    };
    ;
    GMapLoader.prototype.getContainer = function () {
        return !this.properties.container ? this.initDefaultContainer() : this.properties.container; //jquery selector
    };
    ;
    GMapLoader.prototype.popup = function () {
        jQuery(this.container).bPopup({ 'position': ['auto', 'auto'] });
    };
    ;
    GMapLoader.prototype.attachScript = function () {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://maps.google.com/maps/api/js?language=ru-RU&libraries=places&sensor=false&callback=GMapLoader.done&key=AIzaSyAkH-3v3YU1rFSpQxZ3M9k2h-i489bzDU4";
        document.body.appendChild(script);
    };
    ;
    GMapLoader.prototype.build = function (properties, callback) {
        this.properties = properties;
        this.container = this.getContainer();
        this.callback = callback;
        return this;
    };
    ;
    //если скрипты подгружены, то можно выполнить popup. иначе нужно дождаться завершения загрузки и выполнить потом.
    GMapLoader.prototype.show = function () {
        if (this.scriptsLoaded == false) {
            this.defer = this.show;
            return;
        }
        this.defer = null;
        GMap.getInstance().update(this.getContainer(), this.getProperties(), this.getCallback());
        this.popup();
        GMap.getInstance().fitBounds();
    };
    GMapLoader.prototype.load = function () {
        if (this.scriptsLoaded == false) {
            this.defer = this.load;
            return;
        }
        this.defer = null;
        GMap.getInstance().update(this.getContainer(), this.getProperties(), this.getCallback());
    };
    // Map script is loaded.
    // Now find all map containers and attach maps and stuff
    GMapLoader.done = function () {
        GMapLoader.getInstance().scriptsLoaded = true;
        if (GMapLoader.getInstance().defer != null) {
            GMapLoader.getInstance().defer();
        }
    };
    return GMapLoader;
})();
