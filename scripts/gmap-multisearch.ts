/// <reference path="jquery.d.ts" /> 
/// <reference path="google.maps.d.ts" /> 
/// <reference path="markerclusterer.d.ts" />
 
/**   
 * Class GMap
 */

class GMap {

    private static instance: GMap;

    private map_container_class: string;
    private properties: any;
    private callback: Function;
    private markerClusterer: MarkerClusterer;
    private map: google.maps.Map; 
    private markers: Array<google.maps.Marker>; 
    private mapOptions: google.maps.MapOptions;

    public static getInstance(): GMap {
        if (GMap.instance == null) {
            GMap.instance = new GMap();
        }
        return GMap.instance;
    }

    public update(  map_container_class: string,
                    properties: any,
                    callback: Function) {
	        this.map_container_class = map_container_class;
	        this.properties = properties;
	        this.callback = callback;
	        this.initialize(callback);
    }

    public initialize(callback): void {
        this.detachMarkers();
        this.detachMarkerClusterer();
        this.buildMapOptions();
        this.getMap().setOptions(this.getMapOptions());
        this.attachMarkers();
        
        if (callback != null) callback();
    } //initialize 
	
	
    private getMap(): google.maps.Map {
        if (this.map == null) {
            let mapContainer = jQuery(this.map_container_class).first();
            this.map = new google.maps.Map(mapContainer.get(0), this.getMapOptions());
        }
        return this.map;
    }

    private getMapOptions():google.maps.MapOptions{
        if(this.mapOptions == null){
            this.buildMapOptions();
        }
        return this.mapOptions;
    }
    
    
    
    private buildMapOptions() {
        this.mapOptions = new Object();
        // Get defaults from data attribute 
        let mapTypeId = this.determineMapTypeId();
        this.mapOptions.navigationControl = true;
        this.mapOptions.scaleControl = true;
        this.mapOptions.center = this.determineCenterLatLng();
        this.mapOptions.mapTypeId = mapTypeId;

        if ('zoomLevel' in this.properties) {
            this.mapOptions.zoom = this.properties.zoomLevel;
        }
    }


    private attachMarkers() {
        if ('markers' in this.properties) {
            this.attachMultipleMarkers();
        } else{
            if ('lat' in this.properties
                && 'lng' in this.properties
                && 'markerLabel' in this.properties) {
                this.attachSingleMarker();
            }
        }
    }


    public getProperties(): any {
        return this.properties;
    }

    
    private calcCenter(markers: any): google.maps.LatLng {
        var cLat = NaN;
        var cLng = NaN;
        markers.forEach(function(element) {
            var lat = parseFloat(element.lat);
            var lng = parseFloat(element.lng);
            if (isNaN(cLat) || isNaN(cLng)) {
                cLat = lat;
                cLng = lng;
            } else {
                cLat = (cLat + lat) / 2;
                cLng = (cLng + lng) / 2;
            }
        });
        var result = new google.maps.LatLng(
                cLat,
                cLng
         ); 
        return result;
    };


    private determineCenterLatLng(): google.maps.LatLng {
        let centerLatLng = null;
        if ('lat' in this.getProperties() && 'lng' in this.getProperties()) {
            centerLatLng = new google.maps.LatLng(
                this.getProperties().lat,
                this.getProperties().lng);
        } else {
            centerLatLng = this.calcCenter(this.properties.markers);
        }
        return centerLatLng;
    }


    private attachMarkerClusterer(map, markers, options) {
        this.markerClusterer = new MarkerClusterer(map, markers, options);
    }


    private detachMarkers() {
        if(this.markers != null && this.markers.length > 0){
            for(var marker of this.markers) {
                google.maps.event.clearListeners(marker, 'click'); //may be unnecessary
                marker.setMap(null);
            }
            this.markers = null;
        }
    }  

    private detachMarkerClusterer() {
        if (this.markerClusterer != null) {
            this.markerClusterer.clearMarkers();
        }
    }

    private attachSingleMarker() {
        let centerLatLng = this.determineCenterLatLng();
        let marker = new google.maps.Marker({
            position: centerLatLng,
            map: this.getMap()
            //,label: this.properties.markerLabel
        });
        this.markers = [marker];
        
        this.getMap().setCenter(centerLatLng);
        this.getMap().setZoom(this.properties.zoomLevel);
    }
    
    
    private attachMultipleMarkers() {
        //  Create a new viewpoint bound
      //  var bounds = new google.maps.LatLngBounds();
        var self = this;
        self.markers = [];
        var infowindow = new google.maps.InfoWindow();
        this.getProperties().markers.forEach(function(element, index, array) {
            let latlng = new google.maps.LatLng(element.lat, element.lng);
            //  Fit these bounds to the map
        //    bounds.extend(latlng);

            let markerLabel = element.label;
            let title = element.title;
            let address = element.address;
            let href = element.href;
            let imgSrc = element.imgSrc;
            let city = element.city;
            var marker = new google.maps.Marker({
                position: latlng,
                map: self.getMap(),
                title: markerLabel
            });

            self.markers.push(marker);

            if (self.properties.markerTemplate) {
                let contentString = self.getProperties().markerTemplate;
                contentString = contentString.replace("{{href}}", href)
                    .replace("{{img}}", imgSrc)
                    .replace("{{title}}", title)
                    .replace("{{city}}", city)
                    .replace("{{address}}", address);
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(contentString);
                    infowindow.open(self.getMap(), marker);
                });
            }
       //     self.getMap().fitBounds(bounds);
        }); //end markers foreach
			
	    this.attachMarkerClusterer(this.getMap(), this.markers, { imagePath: this.getProperties().imagePath });
	    this.fitBounds();
    }


    public fitBounds():void{
        if(this.getProperties().zoomLevel){
            this.getMap().setZoom(this.getProperties().zoomLevel);
        } else{
            let bounds = new google.maps.LatLngBounds();
    
            for(let marker of this.markers){
                let position = marker.getPosition();
                bounds.extend(position);
            }
            this.getMap().fitBounds(bounds);
        }
    }
    

    private determineMapTypeId(): any {
        // Get defaults from data attribute
        let mapTypeId = google.maps.MapTypeId.ROADMAP; //default
		
        if ("mapTypeId" in this.properties) { //can replace mapTypeId
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
    }
};


/**
 * GMapLoader 
 */

class GMapLoader {
    private static instance: GMapLoader;

    private properties: any;
    private container: any;
    private callback: Function;
    public scriptsLoaded: boolean = false;
	public defer: Function;
	
    constructor() {
        this.properties = {};
        this.container = null;
    };

    public getProperties(): any {
        return this.properties;
    }

    public getCallback(): Function {
        return this.callback;
    }


    public static getInstance(): GMapLoader {
        if (GMapLoader.instance == null) {
            GMapLoader.instance = new GMapLoader();
            GMapLoader.instance.attachScript();
            
        }
        return GMapLoader.instance;
    };


    private initDefaultContainer(): string {
        var containerId = "google-map-search-container";
        var elem = document.getElementById(containerId);
        if (!elem) {
            elem = document.createElement('div');
            elem.setAttribute('id', containerId);
            document.body.appendChild(elem);
        }
        return "#" + containerId;
    };

    public getContainer(): string {
        return !this.properties.container ? this.initDefaultContainer() : this.properties.container; //jquery selector
    };

    private popup(): void {
        jQuery(this.container).bPopup({ 'position': ['auto', 'auto'] });
    };

    public attachScript(): void {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://maps.google.com/maps/api/js?language=ru-RU&libraries=places&sensor=false&callback=GMapLoader.done&key=AIzaSyAkH-3v3YU1rFSpQxZ3M9k2h-i489bzDU4";
        document.body.appendChild(script);
    };

	public build(properties, callback):GMapLoader{
		this.properties = properties;
        this.container = this.getContainer();
        this.callback = callback;
        return this;
	}; 

//если скрипты подгружены, то можно выполнить popup. иначе нужно дождаться завершения загрузки и выполнить потом.
	public show(){
		if(this.scriptsLoaded == false){
			this.defer = this.show;
			return;
		} 
		 
		this.defer = null;
        GMap.getInstance().update(this.getContainer(), this.getProperties(), this.getCallback());
		this.popup();
		GMap.getInstance().fitBounds();
	}

	public load(){
		if(this.scriptsLoaded == false){
			this.defer = this.load;
			return;
		} 		
		this.defer = null;
        GMap.getInstance().update(this.getContainer(), this.getProperties(), this.getCallback());
	}
	
    // Map script is loaded.
    // Now find all map containers and attach maps and stuff
    public static done() { 
    	GMapLoader.getInstance().scriptsLoaded = true;
    	if(GMapLoader.getInstance().defer != null){
    		GMapLoader.getInstance().defer();
    	}
    }
}

