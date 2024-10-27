var geometry = ee.Geometry.Rectangle([-72.20, -42.5, -71.43, -43.2]);
Map.addLayer(geometry, null, 'Los Alerces');
Map.centerObject(geometry,7)
//Función para calcular NDSI, NDWI y la máscara de nieve para Sentinel 2
var indices = function(image) {
var ndsi = image.normalizedDifference(['B3', 'B11']).rename('NDSI');
var ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI');
var nir = image.select(['B8']);
var mascara = ndsi.updateMask(ndsi.gte(0.40).and(nir.gte(0.11)).and(ndwi.lt(0.5)))
.rename('mascara');
return image.addBands(ndsi).addBands(mascara).addBands(ndwi);
};
// Selección y filtrado de colección Sentinel-2 Level-2
var dataset = ee.ImageCollection('COPERNICUS/S2_SR')
.filterDate('2022-01-30', '2022-12-31')
.filterBounds (geometry)
.filter(ee.Filter.eq('SENSING_ORBIT_NUMBER', 53))
.filter(ee.Filter.or(ee.Filter.and(ee.Filter.eq('MGRS_TILE', '18GYT'))))
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
.map(indices);
print ('dataset', dataset);
// Visualización en mapa de producto NDSI y máscara de nieve (primera imágen de la colección)
Map.addLayer(ee.Image(dataset.first()), {
bands:['NDSI'],

palette:['blue', 'white', 'green'],
min:-1, max:1
}, 'NDSI S2');

Map.addLayer(ee.Image(dataset.first()), {
bands:['mascara'],
palette:['blue'],
min:-1, max:1
}, 'mascara S2');

// Confección de gráfico de serie de tiempo de píxeles con nieve
var pixel_nieve = ui.Chart.image.seriesByRegion(
dataset, geometry, ee.Reducer.sum(), 'mascara', 10, 'system:time_start', 'id')
.setChartType('ScatterChart')
.setOptions({
title: 'pixeles de nieve S2',
vAxis: {title: 'pixeles'},
hAxis: {title: 'Date'},
lineWidth: 1,
pointSize: 4,
colors: ['cyan']
});
print(pixel_nieve);
// Selección de una sola imágen por fecha y bandas útiles
// Función para recortar imágen al tamaño del polígono
function clp(img) {return img.clip(geometry);}
var nov01 = dataset.filterDate('2022-10-30', '2022-11-03').select(['mascara', 'NDSI', 'NDWI',
'B2','B3','B4']).map(clp);
print('noviembre 01', nov01);

// DESCARGA DE IMAGE COLLECTION
var ExportCol = function(col, folder, scale, type,
nimg, maxPixels, region) {

type = type || "float";
nimg = nimg || 500;
scale = scale || 10;
maxPixels = maxPixels || 1e10;
var colList = col.toList(nimg);
var n = colList.size().getInfo();
for (var i = 0; i < n; i++) {
var img = ee.Image(colList.get(i));
var id = img.id().getInfo();
region = region || img.geometry().bounds().getInfo()["coordinates"];
var imgtype = {"float":img.toFloat(),
"byte":img.toByte(),
"int":img.toInt(),
"double":img.toDouble()
}
Export.image.toDrive({
image:imgtype[type],
description: id,
folder: folder,
fileNamePrefix: id,
region: geometry, //si no se especifica el region se exporta toda la imagen
scale: scale,
maxPixels: maxPixels})
}
}
ExportCol(nov01.select(['mascara', 'NDSI', 'NDWI', 'B2','B3','B4']), "clase_diplo", 10, "float", 500,
1e10);

var dataset_SAR = ee.ImageCollection('COPERNICUS/S1_GRD')
.filterDate('2022-01-01', '2022-12-31')
.filter(ee.Filter.eq('instrumentMode', 'IW'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
.filter(ee.Filter.eq('relativeOrbitNumber_start', 164))
.filter(ee.Filter.eq('sliceNumber', 5))
.filterBounds(geometry)
print('coleccion SAR', dataset_SAR);

// Visualización en mapa de una imagen VV de Sentinel-1 (primera imágen de la colección)
Map.addLayer(ee.Image(dataset_SAR.first()), {
bands:['VV'],
palette:['F2F2F2','EFC2B3','ECB176','E9BD3A','E6E600','63C600','00A600'],
min:-25, max:25
}, 'imagen SAR VV');

// Selección de imágenes de la colección para realizar la detección de cambios
var ene07_SAR = ee.Image
('COPERNICUS/S1_GRD/S1A_IW_GRDH_1SDV_20220107T234154_20220107T234219_041361_04EAE6_8DEB');
print('enero 07 SAR', ene07_SAR);
var nov03_SAR = ee.Image
('COPERNICUS/S1_GRD/S1A_IW_GRDH_1SDV_20221103T234202_20221103T234227_045736_05785D_9379');
print('noviembre 03 SAR', nov03_SAR);
Map.addLayer(ene07_SAR, {min:-15,max:0}, 'enero 07');
Map.addLayer(nov03_SAR, {min:-15,max:0}, 'noviembre 01');

////// ---> Cálculo de diferencia en dB de imágenes SAR (change detection methodology by Nagler et al 2000)
var dif_SAR = nov03_SAR.select('VV').subtract(ene07_SAR).select('VV');
Map.addLayer(dif_SAR, {min:-30,max:10}, 'Deteccion de cambio');
print('imagen diferencia SAR', dif_SAR)
////// ---> Aplicar umbral de cambio
var wet_snow = dif_SAR.updateMask(dif_SAR.lt(-3))
// rename the band
.rename('wet');
print('wet_snow', wet_snow)
Map.addLayer(wet_snow, {min:-1,max:1}, 'Nieve humeda')

// Exportar la máscara de nieve húmeda a carpeta en Drive
Export.image.toDrive({
image: wet_snow.clip(geometry),
description: 'imagen nieve humeda',
scale: 10,
region: geometry,
fileFormat: 'GeoTIFF',
});