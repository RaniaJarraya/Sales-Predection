//URL Geoserver
var url_geoserver =  "http://localhost:8080/geoserver/wms";

//url des couches
var access_layer_adm1 = "projet_teb:secteurs";
var access_layer_adm2 = "projet_teb:join";
var access_layer_adm4 = "projet_teb:homme";
var access_layer_adm3 = "projet_teb:roads_utm";
var access_layer_adm5 = "projet_teb:femmes";
var access_layer_adm6 = "projet_teb:age_1";
var access_layer_adm7 = "projet_teb:age_2";
var access_layer_adm8 = "projet_teb:age_3";
var access_layer_adm9 = "projet_teb:achat_tot";
//Definition des popups pour affichage des infos
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};

//déclaration des couches openlayers
var lyr_adm1 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm1, "TILED": "true"}})),
    title: "Secteur" });

lyr_adm1.setVisible(true);
var lyr_adm2 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm2, "TILED": "true"}})),
    title: "Btiments_points_join" });

lyr_adm2.setVisible(true);
var lyr_adm3 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm3, "TILED": "true"}})),
    title: "road" });

lyr_adm3.setVisible(true);


var lyr_adm4= new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm4, "TILED": "true"}})),
    title: "homme" });



var lyr_adm5= new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm5, "TILED": "true"}})),
    title: "femmes" });

lyr_adm5.setVisible(true);

var lyr_adm6= new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm6, "TILED": "true"}})),
    title: "age1" });

lyr_adm6.setVisible(true);

var lyr_adm7= new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm7, "TILED": "true"}})),
    title: "age2" });

lyr_adm7.setVisible(true);

var lyr_adm8= new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm8, "TILED": "true"}})),
    title: "age3" });

lyr_adm8.setVisible(true);


var lyr_adm9= new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params:
            {"LAYERS": access_layer_adm9, "TILED": "true"}})),
    title: "total" });

lyr_adm9.setVisible(true);

//déclaration de la liste des couches à afficher
var layersList = [lyr_adm1,lyr_adm2,lyr_adm4,lyr_adm3,lyr_adm5,lyr_adm6,lyr_adm7,lyr_adm8,lyr_adm9];


function parseResponse(data) {
    var poifound = 0;
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(data)
    });
    //console.log(vectorSource);
    var features = vectorSource.getFeatures();
    console.log(features)
    var str=clicked_coord;

    var secteur=features[0].o['NOM_SECTEU'];
    var etageBatiment=features[0].o['Etages'];
    var RevenuMoyen=features[0].o['REVENUS_MO'];
    console.log(secteur);
    console.log(etageBatiment);
    console.log(RevenuMoyen);
    /*for(x in features) {
        var id = features[x].getId();
        var props = features[x].getProperties();
        console.log(props)
        var secteur =props.NOM_SECTEU;
        var etageBatiment  =props.Etages;
        var RevenuMoyen  =props.REVENUS_MO;



    }*/
    if(str) {
        var  str1 = "<meta http-equiv="+"'Content-Type'"+"content="+"'text/html; charset=UTF-8'"+" />"

    str = '<p>' + str + '</p>';
        affichage='<p>' + secteur +'/ ' +etageBatiment +'/ ' +RevenuMoyen+str+'</p> ';
        overlayPopup.setPosition(clicked_coord);
        //content.innerHTML = str; //JSON.stringify(
        content.innerHTML = affichage;
        container.style.display = 'block';
        clicked_pois = 1;
    }
    else{
        container.style.display = 'none';
        closer.blur();
        clicked_pois = 0;
    }
}

//mouse click
var onSingleClick = function(evt) {

    var coord = evt.coordinate;
    console.log(coord);
    var str = coord;
    var source1 = access_layer_adm2;
    var source2 = access_layer_adm1;
    var layers_list = source1 + ',' + source2;
    var view = map.getView();
    var viewResolution = view.getResolution();
    lyr_adm4.setVisible(true);
    url=lyr_adm2.getSource().getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
        {   'INFO_FORMAT': 'text/javascript',
            'FEATURE_COUNT': 20,
            'LAYERS': layers_list,
            'QUERY_LAYERS': layers_list
        });
    console.log(url);
    if (url) { //call parseResponse(data)
         clicked_coord = coord;
         $.ajax(url,
             {dataType: 'jsonp'}
             ).done( parseResponse(url))
        /*if(str) {
            str = '<p>' + str + '</p>';
            overlayPopup.setPosition(coord);
            content.innerHTML = str;
            container.style.display = 'block';

        }
        else{
            container.style.display = 'none';
            closer.blur();
        }*/
}
}

//definir overlay pour le popup
var overlayPopup = new ol.Overlay({
    element: container
});


//info_spatial get features

var map = new ol.Map({
    controls: ol.control.defaults().extend([

        new ol.control.LayerSwitcher({tipLabel: "Layers"}),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326'  })
    ]),
    target: 'map',
    overlays: [overlayPopup],
    layers: layersList,
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [10.3, 36.8988],
        zoom: 11
    })
});


//mouse move
map.on('pointermove', function(event) {
    var coord4326 = event.coordinate;
    var coord3857 = ol.proj.transform(coord4326, 'EPSG:4326', 'EPSG:3857');

    $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
    $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 5)); });


map.on('singleclick', function(evt) {
    onSingleClick(evt);
});


// Define Geometries
var point = new ol.geom.Point(
    ol.proj.transform([9.378840, 34.240721], 'EPSG:4326', 'EPSG:3857')
);
var circle = new ol.geom.Circle(
    ol.proj.transform([9.378840, 34.240721], 'EPSG:4326', 'EPSG:3857'),
    600000
);
// Features
var pointFeature = new ol.Feature(point);
var circleFeature = new ol.Feature(circle);
// Source
var vectorSource = new ol.source.Vector({
    projection: 'EPSG:4326'
});
vectorSource.addFeatures([pointFeature, circleFeature]);
// vector layer
var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});
console.log(vectorLayer)
//add layer to the map
map.addLayer(vectorLayer);




//sites2g
// Vector layer
var features;
var   layerVectorPoint;
$.getJSON("data/sites2g.geojson", function(data) {
    console.log(data)
    features = new ol.format.GeoJSON().readFeatures( data, {
        featureProjection: 'EPSG:4326'
    } );
    for(x in features) {
        var props = features[x].getProperties();
        var id = props["SI"]
        features[x].setId(id);
    }
    var source = new ol.source.Vector({
        features: features,
    });

    layerVectorPoint = new ol.layer.Heatmap({
        source:source
    });
    console.log(layerVectorPoint.getSource().getFeatures().length);
    map.addLayer(layerVectorPoint);

});
var marker = new ol.Overlay({
    element: document.getElementById('location'),
    positioning: 'center-center'
});
map.addOverlay(marker);