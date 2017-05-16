<?php

class GMap{
	private $scriptsInjected = false; 

	private static $instance = null; 
	
	private $markers;
	private $templateContent;
	private $imagesPath;
	private $templateName;
	private $renderer; //implements GmapJSRenderer

	function __construct(){
		$this->injectScripts();
	}
	
	public static function getInstance():GMap{
		if(self::$instance == null){
			 self::$instance = new GMap(); 
		}
		return self::$instance;
	}
	
	public function build(array $markers, GMapJSRenderer $renderer, string $templateName = ""){
		$this->templateName = $templateName;
		$this->markers = $markers;
		if($renderer != null) {
			$this->renderer = $renderer;
			$this->renderer->setGMap($this);
		}
		return $this;
	}
	
		
	public function getImagesPath(){
		if($this->imagesPath == null){
			$this->imagesPath = '/wp-content/plugins/lq-gmap-plugin/images/markercluster/m';
		}
		return $this->imagesPath;
	}
	
	private function forMultiple(){
		return count($this->markers) > 1;
	}
	
	private function forSingle(){
		return count($this->markers == 1);
	}
	
	/**
	@Deprecated
	*/
	public function getRoom(){
		return $this->markers[0];
	}
	
	public function getMarker(){
		return $this->markers[0];
	}
	
	public function getJS():string{
		return $this->renderer->generate();
	}
	
	public function getTemplateContent($templateName){
		if($this->templateContent == null){
			$this->templateContent = str_replace(array("\n", "\t", "\r"), '',file_get_contents(locate_template($templateName.".php")));
		}
		return $this->templateContent;		
	}
	
	public function getTemplateName(){
		return $this->templateName;
	}
	
	
	private function injectScripts(){
		if(!$this->scriptsInjected){
			$jspath = "/wp-content/plugins/lq-gmap-plugin/scripts/";
			wp_enqueue_script("olegeysksite-markerclusterer",
					$jspath."markerclusterer.js",
					array(),
					'1.0' );
			
			wp_enqueue_script("olegeysksite-gmap-multisearch",
					$jspath."gmap-multisearch.js",
					array(),
					'1.0' );
	
			wp_enqueue_script("olegeysksite-bpopup",
					$jspath."jquery.bpopup.min.js",
					array(),
					'1.0' );
			$this->scriptsInjected = true;
		}
		
	}
	
	public function getMarkersJSON(){
		$json = json_encode($this->getMarkers());
		return $json;
	}
	
	
	public function getMarkers(){
		return $this->markers;
	}
}