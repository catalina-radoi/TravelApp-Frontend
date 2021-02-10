import { Component, ViewChild, OnInit, ElementRef, NgZone } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FilterPipe } from 'ngx-filter-pipe';
import { AlertService } from 'ngx-alerts';
import { FormGroupDirective, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Offer } from '../../../../../@types/Offer';
import { MapsAPILoader, MouseEvent } from '@agm/core';





@Component({
  selector: 'app-maps-modal',
  templateUrl: './maps-modal.component.html',
  styleUrls: ['./maps-modal.component.css']
})
export class MapsModalComponent implements OnInit {

  public selectedOffer: Offer;
  public onClose: Subject<Offer>;

  title: string = 'AGM project';
  latitude: number;


  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;


  constructor(
    public bsModalRef: BsModalRef,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,

  ) { }





  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  map: google.maps.Map;


  //Default Marker
  // marker = new google.maps.Marker({
  //   position: this.coordinates,
  //   map: this.map,
  //   title: "Hello World!"
  // });

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    let lat = this.selectedOffer.latitude;
    let lng = this.selectedOffer.longitude;



    let coordinates = new google.maps.LatLng(lat, lng);

    let mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 8
    };
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);


    //Adding other markers
    this.loadAllMarkers();
  }

  loadAllMarkers(): void {
    let markers = [
      {
        position: new google.maps.LatLng(this.selectedOffer.latitude, this.selectedOffer.longitude),
        map: this.map,
        title: this.selectedOffer.hotelName
      },

    ];


    markers.forEach(markerInfo => {
      //Creating a new marker object
      const marker = new google.maps.Marker({
        ...markerInfo
      });

      //creating a new info window with markers info
      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });

      //Add click event to open info window on marker
      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
      });

      //Adding marker to google map
      marker.setMap(this.map);
    });
  }


  ngOnInit(): void {
    // this.onClose = new Subject();

    // this.mapInitializer();
    console.log(this.selectedOffer);
    this.onClose = new Subject();



  }


  public onSave(): void {

    this.onClose.next(this.selectedOffer);
    this.bsModalRef.hide();
  }



  public onCancel(): void {
    this.onClose.next();
    this.bsModalRef.hide();
  }

}


