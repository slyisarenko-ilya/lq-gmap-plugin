Модуль Google Maps integration для Wordpress.

Админского интерфейса пока нет (в работе).


Позволяет указать один или несколько маркеров 
(поля объекта Marker: широта, долгота, название, описание, картинка, ссылка для перехода при щелчке)

и отобразить карту. Либо статически на странице, либо привязать к триггеру и отображать во всплывающем окне при щелчке.

Используются javascript-средства: bPopup, jQuery, MarkerClusterer, GoogleMaps модуль.

Примеры внедрения в тему сайта: 

Статически: 
```
<div class="map">
	<div class="block-title">Геленджикский и Анапский районы на карте</div>
	<?php	$rooms = OEThemeHelper::getAllRooms(); ?>
	<div id="main-map-container" >...</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){ 
			<?php
				
				$markers = ...формируем маркеры...
				GMap::getInstance()->build($markers, new MultipleRoomsJSRenderer("#main-map-container"), 'marker-template');
			    echo GMap::getInstance()->getJS();
		     ?>
		});
	</script>
</div>
```



Динамически:

```
<?php
	$markers = ...формируем массив маркеров (Объект класса Marker модуля lq-gmap-plugin)...
	GMap::getInstance()->build($markers, new MultipleRoomsJSRenderer(), 'marker-template');
?>

<script>
jQuery(document).ready(function(){
	jQuery("#roommap").click(function(e){
		e.preventDefault();
		<?php echo GMap::getInstance()->getJS(); ?>
	});
});
</script>
```



Работающий плагин можно увидеть на страницах моей работы:
```
[- статический, с несколькими маркерами](http://ahmore.ru)
[- динамический, с несколькими маркерами](http://ahmore.ru/city/%d0%ba%d0%b0%d0%b1%d0%b0%d1%80%d0%b4%d0%b8%d0%bd%d0%ba%d0%b0/)
[- статический, с одним маркером](http://ahmore.ru/room/%d0%b3%d0%be%d1%81%d1%82%d0%b5%d0%b2%d0%be%d0%b9-%d0%b4%d0%be%d0%bc-%d1%83%d0%bb-%d1%82%d1%83%d1%80%d0%b3%d0%b5%d0%bd%d0%b5%d0%b2%d0%b0-79/#on-map)
```

