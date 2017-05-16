<?php


class MultipleRoomsJSRenderer implements GMapJsRenderer{
	private $gmap;
	private $containerSelector;
	
	function __construct($containerSelector = null){
		$this->containerSelector = $containerSelector;
	}
	
	public function setGMap(GMap $gmap): GMapJsRenderer{
		$this->gmap = $gmap;
		return $this;
	}
	
	
	private function generateForOverlay():string{
		return "GMapLoader.getInstance().build(
			{'markers':JSON.parse('".$this->gmap->getMarkersJSON()."'),
			'imagePath': '".$this->gmap->getImagesPath()."',
			'markerTemplate':\"".$this->gmap->getTemplateContent($this->gmap->getTemplateName())."\" }).show();	";
	} 
	
	
	private function generateStatic():string{
		return "GMapLoader.getInstance().build(
			{'markers':JSON.parse('".$this->gmap->getMarkersJSON()."'),
			'imagePath': '".$this->gmap->getImagesPath()."',
			". ($this->containerSelector == null? '': '"container": "'.$this->containerSelector.'",') ."
			'markerTemplate':\"".$this->gmap->getTemplateContent($this->gmap->getTemplateName())."\" }).load();	";
	}
	
	
	public function generate():string{
		if($this->containerSelector == null){
			return $this->generateForOverlay(); 
		} else{
			return $this->generateStatic();		
		}
	}
}