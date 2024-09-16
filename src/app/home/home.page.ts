import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private view!: MapView; // Menggunakan non-null assertion

  constructor() {}

  public async ngOnInit() {
    // Inisialisasi peta
    const map = new Map({
      basemap: "topo-vector"
    });

    // Mendapatkan lokasi pengguna atau menggunakan lokasi default UGM
    const coordinates = await this.getCurrentPosition();

    // Buat instance MapView dengan peta dan lokasi
    this.view = new MapView({
      container: "container",
      map: map,
      zoom: 10, // Ubah zoom sesuai kebutuhan
      center: [coordinates.longitude, coordinates.latitude] // Gunakan lokasi
    });
  }

  // Fungsi untuk mendapatkan lokasi pengguna atau menggunakan lokasi default UGM
  private async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location', error);
      // Kembalikan koordinat UGM jika terjadi kesalahan
      return {
        latitude: -7.771632, // Latitude UGM
        longitude: 110.377395 // Longitude UGM
      };
    }
  }
}
