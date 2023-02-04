/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here

	if ($(window).width() >= 600) {
	   // alert('Greater than 600');

		var southWest = L.latLng(30, -112),
	    northEast = L.latLng(39, -130),
	    bounds = L.latLngBounds(southWest, northEast);


		var map = L.map('map', {zoom: 8, center: new L.latLng([37.2,-120.1])}).setMaxBounds(bounds);
		// var pane = map.createPane('fixedbg', document.getElementById('map'));
		var pane = map.createPane('fixed', document.getElementById('map'));
		var pane = map.createPane('bgfixed', document.getElementById('map'));

		var icon = L.icon({
			iconSize: [40, 40],
			iconAnchor: [13, 27],
			popupAnchor:  [1, -24],
		    iconUrl: 'img/icon-w-01.png'
		});

		var hiliteIcon = L.icon({
			iconSize: [40, 40],
			iconAnchor: [13, 27],
			popupAnchor:  [1, -24],
		    iconUrl: 'img/icon-hilite-01.png'
		});

		map.getPane('bgfixed').style.zIndex = 300;

		//background layer
	    var imageUrl = 'img/Background.png',
	    imageBounds = [[30, -112], [37, -125]];
	    L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1);


	    //shade layer
	    var imageUrl = 'img/Shade.png',
	    imageBounds = [[30, -112], [37, -125]];
	    L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1).setZIndex(2);


	    //tile layer
		L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			subdomains: 'abcd',
			opacity: 0.25,
	    	pane: 'overlayPane',
			ext: 'png'
		}).addTo(map);


		map.createPane("polygonsPane");
		map.createPane("polygonsColor");



		// county layer
		$.getJSON("fresno-counties.geojson",function(polygondata){

	    	var myStyle = {
	    		"fillColor": "#407f7b",
			    "color": "white",
			    "weight": 2,
			    "fillOpacity": 0.65
			};

	    	L.geoJson(polygondata, {
	        	style: myStyle,
	        	pane: "polygonsPane",
	        	opacity: 0.55
	    	}).addTo(map).bringToBack();


	    });



		// taco locations layer
		$.getJSON("dd_data_locations.geojson",function(data){

			var items = data;

				items = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.location_notes === "food truck";
				});

				var items_length = items.length

				// console.log(items)

		        for (let i = 0; i < items.length; i++) {
		        	console.log(items[i].properties)

		        	$(".foodtrucklist").append('<div class="foodtruckitem"><div class="textbox"><div class="title"><h3>'+items[i].properties.name+'</h3></div><div class="text"><p><a href="'+items[i].properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+items[i].properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+items[i].properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+items[i].properties.video+'"></iframe></div></div>')
				} 

	          


	    	var layerGroup = L.geoJSON(data, {

	    		pointToLayer: function(feature,latlng){

		        	return L.marker(latlng, {
		        		icon: icon,
		        	});

		        	// L.DomUtil.addClass(marker._icon, 'plusicon');

	        	},
				onEachFeature: function (feature, layer) {


					//no website, only facebook and instagram
					if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a> &#9679 </span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//no facebook, only website and instagram
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//no instgram, only website and facebook
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//only instgram
					} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//only website
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//only facebook
					} else if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//nothing
					} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//everything
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span> &#9679 <span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							

					}

					if (feature.properties.location_notes == "multiple locations") {

						//no website, only facebook and instagram
						if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a> &#9679 </span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//no facebook, only website and instagram
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//no instgram, only website and facebook
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//only instgram
						} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//only website
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//only facebook
						} else if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//nothing
						} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//everything
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span> &#9679 <span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								

						}

							if (feature.properties.video == "coming soon") {

							// 	$(".video").html('<div class="comingsoon">Video coming Soon!</div>')

							//no website, only facebook and instagram
							if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a> &#9679 </span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//no facebook, only website and instagram
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//no instgram, only website and facebook
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//only instgram
							} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//only website
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//only facebook
							} else if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//nothing
							} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//everything
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span> &#9679 <span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									

							}

						}

					}



					




					
				  	

				    layer.bindPopup(popup);

			  }


			}).addTo(map);


	    	//properties for zoom

			var search = new L.Control.Search({
				layer: layerGroup,
				propertyName: 'name',
				circleLocation: false,
				marker: false,
				collapsed: false,
				textPlaceholder: "Search the map",
				zoom: 13	
			});

			search.on('search:locationfound', function(e) {
				var clicked_icon = e.latlng.layer._icon
				// console.log(clicked_icon)

				// console.log(e.layer)

				$(clicked_icon).attr("src", "img/icon-hilite-01.png").css({"z-index": "1000"}).addClass("selected-icon")
				$(clicked_icon).siblings().attr("src", "img/icon-w-01.png").removeClass("selected-icon")

				 e.layer.openPopup();

				 $(".leaflet-fixed-pane").fadeIn()

			});
			
			map.addControl( search );  //inizialize search control

			// search


			$(".leaflet-marker-icon").on("click", function(e){
				$(".leaflet-fixed-pane").show()
				$(this).addClass("selected-icon").attr("src", "img/icon-hilite-01.png")
				$(this).siblings().attr("src", "img/icon-w-01.png").removeClass("selected-icon")

			});


			$(document.body).on('click', '.new-close-button' ,function(){
				// alert("HIDE POPUP")
				$(".leaflet-fixed-pane").hide().empty()
				// $(".selected-icon").removeClass("selected-icon")
				$(".selected-icon").attr("src", "img/icon-w-01.png").removeClass("selected-icon")
				
			});




	    });


	}
	else {
	   // alert('Less than 600');

		var southWest = L.latLng(30, -112),
	    northEast = L.latLng(39, -130),
	    bounds = L.latLngBounds(southWest, northEast);


		var map = L.map('map', {minZoom: 8}).setView([37,-119.76], 8).setMaxBounds(bounds);
		// var pane = map.createPane('fixedbg', document.getElementById('map'));
		var pane = map.createPane('fixed', document.getElementById('map'));
		var pane = map.createPane('bgfixed', document.getElementById('map'));

		var icon = L.icon({
			iconSize: [40, 40],
			iconAnchor: [13, 27],
			popupAnchor:  [1, -24],
		    iconUrl: 'img/icon-w-01.png'
		});

		var hiliteIcon = L.icon({
			iconSize: [40, 40],
			iconAnchor: [13, 27],
			popupAnchor:  [1, -24],
		    iconUrl: 'img/icon-hilite-01.png'
		});

		map.getPane('bgfixed').style.zIndex = 300;

		//background layer
	    var imageUrl = 'img/Background.png',
	    imageBounds = [[30, -112], [37, -125]];
	    L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1);


	    //shade layer
	    var imageUrl = 'img/Shade.png',
	    imageBounds = [[30, -112], [37, -125]];
	    L.imageOverlay(imageUrl, imageBounds, {pane: 'bgfixed'}).addTo(map).setOpacity(1).setZIndex(2);


	    //tile layer
		L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			subdomains: 'abcd',
			opacity: 0.25,
	    	pane: 'overlayPane',
			ext: 'png'
		}).addTo(map);


		map.createPane("polygonsPane");
		map.createPane("polygonsColor");



		// county layer
		$.getJSON("fresno-counties.geojson",function(polygondata){

	    	var myStyle = {
	    		"fillColor": "#407f7b",
			    "color": "white",
			    "weight": 2,
			    "fillOpacity": 0.65
			};

	    	L.geoJson(polygondata, {
	        	style: myStyle,
	        	pane: "polygonsPane",
	        	opacity: 0.55
	    	}).addTo(map).bringToBack();


	    });



		// taco locations layer
		$.getJSON("dd_data_locations.geojson",function(data){

			var items = data;

				items = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.location_notes === "food truck";
				});

				var items_length = items.length

				console.log(items)

		        for (let i = 0; i < items.length; i++) {
		        	console.log(items[i].properties)

		        	$(".foodtrucklist").append('<div class="foodtruckitem"><div class="textbox"><div class="title"><h3>'+items[i].properties.name+'</h3></div><div class="text"><p><a href="'+items[i].properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+items[i].properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+items[i].properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+items[i].properties.video+'"></iframe></div></div>')
				} 

	          


	    	var layerGroup = L.geoJSON(data, {

	    		pointToLayer: function(feature,latlng){

		        	return L.marker(latlng, {
		        		icon: icon,
		        	});

		        	// L.DomUtil.addClass(marker._icon, 'plusicon');

	        	},
				onEachFeature: function (feature, layer) {

					//no website, only facebook and instagram
					if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a> &#9679 </span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//no facebook, only website and instagram
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//no instgram, only website and facebook
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//only instgram
					} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//only website
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//only facebook
					} else if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//nothing
					} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							
					//everything
					} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
						var popup = L.popup({
						  	pane: 'fixed',
						  	className: 'popup-fixed',
						  	autoPan: false,
						}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span> &#9679 <span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
							

					}

					if (feature.properties.location_notes == "multiple locations") {

						//no website, only facebook and instagram
						if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a> &#9679 </span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//no facebook, only website and instagram
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//no instgram, only website and facebook
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//only instgram
						} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//only website
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//only facebook
						} else if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//nothing
						} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								
						//everything
						} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
							var popup = L.popup({
							  	pane: 'fixed',
							  	className: 'popup-fixed',
							  	autoPan: false,
							}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span> &#9679 <span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><iframe scrolling="no" src="'+feature.properties.video+'"></iframe></div>');
								

						}

							if (feature.properties.video == "coming soon") {

							// 	$(".video").html('<div class="comingsoon">Video coming Soon!</div>')

							//no website, only facebook and instagram
							if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a> &#9679 </span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//no facebook, only website and instagram
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span></span><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//no instgram, only website and facebook
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//only instgram
							} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//only website
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//only facebook
							} else if ((feature.properties.website == "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//nothing
							} else if ((feature.properties.website == "N/A") && (feature.properties.facebook == "N/A") && (feature.properties.instagram == "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									
							//everything
							} else if ((feature.properties.website != "N/A") && (feature.properties.facebook != "N/A") && (feature.properties.instagram != "N/A")) {
								var popup = L.popup({
								  	pane: 'fixed',
								  	className: 'popup-fixed',
								  	autoPan: false,
								}).setContent('<div class="textbox"><div class="new-close-button"><img src="img/exit.png"></div><div class="title"><h3>'+feature.properties.name+'</h3></div><div class="text"><p><span class="address">' + feature.properties.location + '*</span><br> <a href="'+feature.properties.story+'" target="_blank">Click here for the full story</a></p><p><span class="website"><a href="'+feature.properties.website+'" target="_Blank">Website</a> &#9679 </span><span class="facebook"><a href="'+feature.properties.facebook+'" target="_Blank">Facebook</a></span> &#9679 <span class="instagram"><a href="'+feature.properties.instagram+'" target="_Blank">Instagram</a></span></p><i>*Multiple locations</i></div></div><div class="video"><div class="comingsoon">Video coming Soon!</div></div>');
									

							}

						}

					}
				  	

				    layer.bindPopup(popup);

			  }


			}).addTo(map);


	    	//properties for zoom

			var search = new L.Control.Search({
				layer: layerGroup,
				propertyName: 'name',
				circleLocation: false,
				marker: false,
				collapsed: false,
				textPlaceholder: "Search the map",
				zoom: 13	
			});

			search.on('search:locationfound', function(e) {
				var clicked_icon = e.latlng.layer._icon
				console.log(clicked_icon)

				console.log(e.layer)

				$(clicked_icon).attr("src", "img/icon-hilite-01.png").css({"z-index": "1000"}).addClass("selected-icon")
				$(clicked_icon).siblings().attr("src", "img/icon-w-01.png").removeClass("selected-icon")

				 e.layer.openPopup();

				 $(".leaflet-fixed-pane").fadeIn()

			});
			
			map.addControl( search );  //inizialize search control


			


			$(".leaflet-marker-icon").on("click", function(e){
				$(".leaflet-fixed-pane").show()
				$(this).addClass("selected-icon").attr("src", "img/icon-hilite-01.png")
				$(this).siblings().attr("src", "img/icon-w-01.png").removeClass("selected-icon")

			});


			$(document.body).on('click', '.new-close-button' ,function(){
				// alert("HIDE POPUP")
				$(".leaflet-fixed-pane").hide().empty()
				// $(".selected-icon").removeClass("selected-icon")
				$(".selected-icon").attr("src", "img/icon-w-01.png").removeClass("selected-icon")
				
			});




	    });

	}

	$("#foodtrucks").click(function(){
		console.log("CLICK!!!")
		$('.foodtruck-outer').fadeIn()
	});

	$(".exit-food-truck").click(function(){
		console.log("EXIT!!")
		$('.foodtruck-outer').fadeOut()
	})


	

    



    
	



}); //end document.ready block
