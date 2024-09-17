import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; // Impor Point
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'; // Impor PictureMarkerSymbol
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView: MapView | any;
  userLocationGraphic : Graphic | any;

  constructor () {}

  async ngOnInit() {
    const map = new Map({
      basemap: "topo-vector"
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 8
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }
  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
          symbol: new SimpleMarkerSymbol(),
          geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
}

const WeatherServiceUrl =
  'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
  //constructor() {}

  // private latitude: number | any;
  // private longitude: number | any;


  // public async ngOnInit() {
  //   try {
  //     const position = await Geolocation.getCurrentPosition();
  //     this.latitude = position.coords.latitude;
  //     this.longitude = position.coords.longitude;

  //     console.log('Latitude:', this.latitude);
  //     console.log('Longitude:', this.longitude);

  //     // Buat instance peta
  //     const map = new Map({
  //       basemap: "topo-vector"
  //     });

  //     const view = new MapView({
  //       container: "container",
  //       map: map,
  //       zoom: 14, // Adjust zoom level as needed
  //       center: [this.longitude, this.latitude] // Longitude, Latitude
  //     });

  //     // Gunakan class Point dari ArcGIS API
  //     const point = new Point({
  //       longitude: this.longitude,
  //       latitude: this.latitude
  //     });

  //     // Definisikan PictureMarkerSymbol dengan gambar rumah
  //     const markerSymbol = new PictureMarkerSymbol({
  //       url: 'assets/download.png', // Path relatif ke gambar
  //       width: '32px', // Lebar simbol
  //       height: '32px' // Tinggi simbol
  //     });

  //     const pointGraphic = new Graphic({
  //       geometry: point,  // Menggunakan class Point sebagai geometri
  //       symbol: markerSymbol
  //     });

  //     // Tambahkan marker ke peta
  //     view.graphics.add(pointGraphic);
  //   } catch (error) {
  //     console.error("Error getting location or adding marker:", error);
  //   }
  // }
