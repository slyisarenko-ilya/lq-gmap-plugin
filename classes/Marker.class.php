<?php

class Marker implements JsonSerializable{
	private $address;
	private $title;
	private $city;
	private $href;
	private $lat;
	private $lng;
	private $imgSrc;
	
	public function jsonSerialize() {
		$a = array();
		$a['address'] = $this->getAddress();
		$a['title'] = $this->getTitle();
		$a['city'] = $this->getCity();
		$a['href'] = $this->getHref();
		$a['lat'] = $this->getLat();
		$a['lng'] = $this->getLng();
		$a['imgSrc'] = $this->getImgSrc();
		return $a;
	}
	
    public function getAddress(){
        return $this->address;
    }

    public function setAddress($address){
        $this->address = $address;
        return $this;
    }

    public function getTitle(){
        return $this->title;
    }

    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    public function getCity(){
        return $this->city;
    }

    public function setCity($city){
        $this->city = $city;
        return $this;
    }

    public function getHref(){
        return $this->href;
    }

    public function setHref($href){
        $this->href = $href;
        return $this;
    }

    public function getLat(){
        return $this->lat;
    }

    public function setLat($lat){
        $this->lat = $lat;
        return $this;
    }

    public function getLng(){
        return $this->lng;
    }

    public function setLng($lng){
        $this->lng = $lng;
        return $this;
    }

    public function getImgSrc(){
        return $this->imgSrc;
    }

    public function setImgSrc($imgSrc){
        $this->imgSrc = $imgSrc;
        return $this;
    }

}