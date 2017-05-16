<?php


class GMapRawDecorator{
	private $mapAr;
	
	function __construct($mapAr){
		$this->mapAr = $mapAr;
	}
	
	
	function getRawMap(){
		return $this->mapAr;
	}
	
	function has(){
		return $this->mapAr && count($this->mapAr) > 0;
	}
	
	function getFormattedAddress(){
		return $this->mapAr['formatted_address'];		
	}
	

	function getZoom(){
		return array_key_exists('preferred_zoom', $this->mapAr)&&!empty($this->mapAr['preferred_zoom'])?$this->mapAr['preferred_zoom']: 16;
	}
	
	function getLattitude(){
		return $this->mapAr['lat'];
	}
	
	function getLongitude(){
		return $this->mapAr['lng']; 
	}
	
	function getMapType(){
		$maptype = 'ROADMAP';
		if(array_key_exists('static_maps', $this->mapAr)){
			$mapRawSource = $this->mapAr['static_maps']['thumbnail'];
			preg_match( '/\[&maptype=(.*?)&\]/', $mapRawSource , $match );
			if(count($match) > 0){
				$maptype = $match[1];
			}
		};
		return $maptype;
	}
}