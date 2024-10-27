# Análisis de Riesgos de Avalanchas y Aludes en Áreas de Fusión de Nieve

Este repositorio contiene el código y los datos para el análisis de riesgos de avalanchas y aludes en áreas de fusión de nieve en la región patagónica utilizando Google Earth Engine (GEE) y QGIS. El objetivo principal es identificar áreas de riesgo mediante la detección de nieve y nieve en proceso de fusión a partir de datos satelitales.

## Estructura del Proyecto

- **data/**: Contiene los archivos de datos utilizados para el análisis:
  - `area_protegida.shp`: Archivo Shapefile con la delimitación de las áreas protegidas en la región.
  - `ee-chart.csv`: Datos de la serie temporal de cobertura nívea.

- **scripts/**: Contiene los scripts para la ejecución del análisis en Google Earth Engine.
  - `analysis_GEE.js`: Script JavaScript para GEE, que realiza la detección de nieve y la exportación de resultados.

- **images/**: Contiene capturas de pantalla y visualizaciones generadas durante el análisis, útiles para entender los resultados.
  - `NieveHumeda_zonas.png`: Mapa de áreas con nieve húmeda.
  - `NDSI_mapa.png`: Mapa de NDSI con la cobertura de nieve.
  - `ee-chart.png`: Gráfico de la serie temporal.
  - `script_GEE.png`: Ejemplo de la visualización de los datos en Google Earth Engine.

## Requisitos

Para reproducir el análisis, necesitas:

- **Google Earth Engine**: [Accede a GEE](https://code.earthengine.google.com/) y crea una cuenta si aún no tienes una.
- **QGIS**: [Descargar QGIS](https://qgis.org/en/site/forusers/download.html) para la visualización y procesamiento de datos geoespaciales.
- **Git**: [Instalar Git](https://git-scm.com/) para clonar el repositorio y gestionar el proyecto.

## Instrucciones de Uso

1. **Clona el repositorio**:
   ```
   git clone https://github.com/Aixa11/SnowRisk-Analysis.git
   cd SnowRisk-Analysis
   ```
## Pequeños Pasos ##

1. **Sube los datos a Google Earth Engine:**
- En la consola de GEE, sube el archivo area_protegida.shp desde la sección Assets.
Copia el script de scripts/analysis_GEE.js y pégalo en la consola de GEE para ejecutar el análisis.
2. **Ejecuta el análisis en GEE:**
- Ajusta la zona de interés y las fechas en el script analysis_GEE.js según las necesidades del análisis.
- Ejecuta el script para obtener los mapas de NDSI y las áreas de nieve húmeda.
3. **Visualiza los Resultados en QGIS:**
- Importa los archivos .tif descargados en DRIVE a QGIS para una visualización detallada.
- Utiliza el archivo ee-chart.csv para generar gráficos en QGIS o en un software de análisis de datos como Excel o Python.

## Descripción de los Resultados
**Mapas y Gráficos**

- **Detección de Nieve Húmeda**:  
  ![NieveHumeda_zonas.png](./Fusion%20de%20la%20Nieve/images/NieveHumeda_zonas.png)  
  *Descripción*: Utilizando datos SAR, este mapa muestra las áreas donde la nieve está en proceso de fusión, lo cual incrementa el riesgo de aludes. El análisis de nieve húmeda es esencial para detectar cambios en la estabilidad de la nieve. Sistema de referencia utilizado: **EPSG:32719 (WGS 84 / UTM zone 19S)**.

- **Cobertura de Nieve (NDSI)**:  
  ![NDSI_mapa.png](./Fusion%20de%20la%20Nieve/images/NDSI_mapa.png)  
  *Descripción*: Este mapa muestra la cobertura de nieve utilizando el índice NDSI, que es clave para identificar áreas con presencia de nieve durante el invierno y principios de primavera. Ayuda a visualizar la extensión de las zonas cubiertas por nieve y es un componente esencial para entender el riesgo de avalanchas al inicio del período de deshielo. Sistema de referencia utilizado: **EPSG:32719 (WGS 84 / UTM zone 19S)**.

- **Serie Temporal de Cobertura de Nieve**:  
  ![ee-chart.png](./Fusion%20de%20la%20Nieve/images/ee-chart.png)  
  *Descripción*: Gráfico que muestra la evolución de la cobertura de nieve a lo largo del año 2022. Se observa un aumento de la cobertura durante el invierno y una disminución progresiva hacia la primavera, reflejando la variabilidad estacional.

- **Visualización en Google Earth Engine**:  
  ![script_GEE.png](./Fusion%20de%20la%20Nieve/images/script_GEE.png)  
  *Descripción*: Captura de pantalla de la visualización de los datos de NDSI y nieve húmeda en la consola de Google Earth Engine. Muestra cómo se integra la información de diferentes bandas para el análisis de nieve en la región.# SnowRisk-Analysis
