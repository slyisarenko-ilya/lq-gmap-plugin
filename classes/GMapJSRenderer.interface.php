<?php

interface GMapJsRenderer{
	public function generate(): string;
	public function setGMap(GMap $gmap);
}

