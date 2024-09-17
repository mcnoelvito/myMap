import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from  '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView: MapView | any; // Menggunakan non-null assertion
  userLocationGraphic: Graphic | any;
  constructor() {}

  // public
  async ngOnInit() {
  //   // Inisialisasi peta
  const map = new Map({
       basemap: "topo-vector"
  });

  //   // Mendapatkan lokasi pengguna atau menggunakan lokasi default UGM
  //   const coordinates = await this.getCurrentPosition();

  //   // Buat instance MapView dengan peta dan lokasi
     this.mapView = new MapView({
       container: "container",
       map: map,
      zoom: 8, // Ubah zoom sesuai kebutuhan
  //     center: [coordinates.longitude, coordinates.latitude] // Gunakan lokasi
     });
     await this. updateUserLocationOnMap();
     this.mapView. center = this. userLocationGraphic.geometry as Point;
     setInterval(this.updateUserLocationOnMap.bind(this), 10000);
    }
     async getLocationService(): Promise<number[]> {
     return new Promise((resolve, reject) => {
     navigator.geolocation.getCurrentPosition((resp) => {
     resolve([resp.coords.latitude, resp.coords.longitude]) ;
     });
     });
    }

     async updateUserLocationOnMap() {
     let latLng = await this. getLocationService();
     let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
     let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
     //map.add(weatherServiceFL);
     if (this.userLocationGraphic) {
     this.userLocationGraphic.geometry = geom;
     } else {
     this.userLocationGraphic = new Graphic({
     symbol: new SimpleMarkerSymbol(),
     geometry: geom,
     });
     this.mapView. graphics.add(this.userLocationGraphic);
    }
  }
}
const WeatherServiceUrl ='https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

  // Fungsi untuk mendapatkan lokasi pengguna atau menggunakan lokasi default UGM
  // private async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  //   try {
  //     const position = await Geolocation.getCurrentPosition();
  //     return {
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude
  //     };
  //   } catch (error) {
  //     console.error('Error getting location', error);
  //     // Kembalikan koordinat UGM jika terjadi kesalahan
  //     return {
  //       latitude: -7.771632, // Latitude UGM
  //       longitude: 110.377395 // Longitude UGM
  //     };
  //   }
  // }



