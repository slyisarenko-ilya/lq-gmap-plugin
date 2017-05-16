<?php 
/**
 * Plugin Name: lq-gmap-plugin
 * Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
 * Description: Wordpress google map integrator 
 * Version: 1.0
 * Author: Liquid Crystal Web Master
 * Author URI: http://liquid-crystal.ru
 * Text Domain: lq-gmap-plugin
 * Domain Path: lq-gmap-plugin
 */


require_once dirname(__FILE__ ). '/classes/Marker.class.php';

require_once dirname(__FILE__ ). '/classes/GMapRawDecorator.class.php'; //just include before RoomDecorator
require_once dirname(__FILE__ ). '/classes/GMapJSRenderer.interface.php';
require_once dirname(__FILE__ ). '/classes/SingleRoomJSRenderer.class.php';
require_once dirname(__FILE__ ). '/classes/MultipleRoomsJSRenderer.class.php';

require_once dirname(__FILE__ ). '/classes/GMap.class.php';

