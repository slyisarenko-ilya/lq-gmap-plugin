<?php

class SingleRoomJSRenderer implements GMapJsRenderer{
	private $gmap;
	private $containerSelector;
	
	function __construct($containerSelector = null){
		$this->containerSelector = $containerSelector;
	}
	
	public function setGMap(GMap $gmap): GMapJsRenderer{
		$this->gmap = $gmap;
		return $this;
	}
	
	
	public function generate():string{
		$map = (RoomDecorator::get($this->gmap->getRoom()))->getMap();
		if($this->containerSelector == null){
			return "GMapLoader.getInstance().build({
					markerLabel: '".$map->getFormattedAddress()."',
					zoomLevel: ".$map->getZoom().",
	                lat: ".$map->getLattitude().",
	                lng: ".$map->getLongitude().",
		       		mapTypeId: '".$map->getMapType()."',
		       		markerTemplate: \"".$this->gmap->getTemplateContent($this->gmap->getTemplateName())."\" })
		       		.show();";
		} else{
			return "GMapLoader.getInstance().build({
					markerLabel: '".$map->getFormattedAddress()."',
					zoomLevel: ".$map->getZoom().",
	                lat: ".$map->getLattitude().",
	                lng: ".$map->getLongitude().",
	                container: '".$this->containerSelector."',
	                mapTypeId: '".$map->getMapType()."'
	        }).load();";
		}
	}
	
}
