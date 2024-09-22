import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  isGalleryVisible = false;
  basemapGallery: BasemapGallery | any; // Simpan referensi widget basemap gallery

  constructor() {}

  toggleGallery() {
    this.isGalleryVisible = !this.isGalleryVisible;

    // Jika galeri terlihat, tambahkan widget BasemapGallery
    if (this.isGalleryVisible) {
      this.basemapGallery = new BasemapGallery({
        view: this.mapView,
        source: {
          portal: {
            url: "https://www.arcgis.com",
            useVectorBasemaps: true
          }
        }
      });

      this.mapView.ui.add(this.basemapGallery, {
        position: "top-right"
      });

    // Jika galeri tidak terlihat, hapus widget BasemapGallery
    } else {
      if (this.basemapGallery) {
        this.mapView.ui.remove(this.basemapGallery);
      }
    }
  }


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

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';
