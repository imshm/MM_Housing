// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-mapshow',
//   templateUrl: './mapshow.page.html',
//   styleUrls: ['./mapshow.page.scss'],
// })
// export class MapshowPage implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
import { Component,Input, OnInit ,ElementRef, ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import {
	NavController,
	LoadingController,
	IonSlides,
	AlertController,NavParams
} from '@ionic/angular';
import {HelperService} from '../Services/helper.service';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {ApiService} from '../Services/api.service';
declare var google;
declare var require: any
const FileSaver = require('file-saver');

interface Marker {
	
	  lat: number,
	  lng: number,
  }
  @Component({
    selector: 'app-mapshow',
    templateUrl: './mapshow.page.html',
    styleUrls: ['./mapshow.page.scss'],
  })
  export class MapshowPage implements OnInit {
	//dataSlider = true;
	@Input() name: string;
	pdfFiles = [
		{
		  name:'PDF File One',
		  startPage: 2,
		  path: '../new_document.pdf'
		},
		{
			name:'PDF File One',
			startPage: 2,
			path: '../new_document.pdf'
		  },
	  ]
	resultData = {}
	data: any = {};
	score: any;
	getValue: any;
	latitude: number;
  longitude: number;
  map: any;
  maps = [];
  numbers = [0,1,2];
  firstLoad = true;
  slides = [
    { name: "Slide 1", imgUrl: "https://aws1.discourse-cdn.com/ionicframework/original/3X/9/4/94850a46742204751c28bbe6d78168d7e870ce80.png" },
    { name: "Slide 2", imgUrl: "https://aws1.discourse-cdn.com/ionicframework/original/3X/9/4/94850a46742204751c28bbe6d78168d7e870ce80.png" },
    { name: "Slide 3", imgUrl: "https://aws1.discourse-cdn.com/ionicframework/original/3X/9/4/94850a46742204751c28bbe6d78168d7e870ce80.png" }
  ]
  @ViewChild('slider') private slider: IonSlides;
  
//	@ViewChild('map', { static: true }) mapRef: ElementRef;
	markers =  [
		{
			lat: 26.881111279644927,
			lng: 75.7322248008731,
		}, 
		{
			lat: 26.88130267046367,
			lng: 75.73659143712501,
		},
	  ];
	  id = [{Id :"map1"},{Id :"map2"},{Id :"map3"},{Id :"map4"}];
	loadid: any;
	mapsStartLoaded: any;
	newval: any;
	segment: number;
	score_data: any;
	item: any;
	//refresh: any;
// 	directionsService = new google.maps.DirectionsService;
//   directionsDisplay = new google.maps.DirectionsRenderer;
	//images: any;
  constructor(public menu: MenuController,
	public modalCtrl: ModalController,public navParams: NavParams, private router: Router,private storage: Storage,private sanitizer: DomSanitizer,public navCtrl: NavController,private alertDialog: AlertController,
	private helper: HelperService,private fileOpener: FileOpener,private api: ApiService,
	public geolocation: Geolocation,public file: File,public http: HTTP, private platform: Platform,	public transfer: FileTransfer,private androidPermissions: AndroidPermissions,) 
  { 
	//console.log(navParams.get('name'));
	this.data.username = '';
	this.helper.navParams().then((item: any) => {
		this.item = item;
		console.log('longitude', item);
		// if (item) {
		//   this.resultData = item.test.score || '';
		//   console.log('longitude', this.resultData);
		// }
	  }).catch(() => {});
	
	  this.storage.get('_SCORE_DATA').then((score_data) => {
		this.score_data = score_data;
		var body = JSON.stringify({
			data: this.item,
			score_data: score_data});
		//this.score_data['data'] = this.item;
		console.log('type', body);
	  });
  }
  submit(id)
  {
  console.log("hello useranme " + this.data.username);
  this.helper.pushPage('/category', this.data.username).catch(() => {});
  this.closeModal();
  }
  ngOnInit() {
	this.loadMaps();
	this.menu.enable(false);
	// this.latitude = 26.8819878;
	// this.longitude = 75.7344081;
	//  if(this.latitude != null && this.longitude != null )
	//  {
	//  const location = new google.maps.LatLng(this.latitude, this.longitude);
	//  this.map = new google.maps.Map(
	//    this.mapRef.nativeElement,{
	// 	 center: location,
	// 	 zoom:16,
	// 	 mapTypeId: google.maps.MapTypeId.ROADMAP
	//    });
	//    this.addMarker();//here you call the method.
	 
	//  }
	//this.loadMaps(id);
		//this.loadmap_id();
		//this.loadMap1();
		//this.calculateAndDisplayRoute();
  }
  public closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
ionViewWillEnter() {
	console.log('ionViewDidLoad CartPage');
	// for (let i = 0; i < this.id.length; i++) {
	// 	console.log ("Block statement execution no." + this.id[i].Id);
	// 	this.loadMaps(this.id[i].Id);
	//   }
	
  }
//   addMarker(){
//     let marker = new google.maps.Marker({
//       map: this.map,
//       animation: google.maps.Animation.DROP,
//       position: this.map.getCenter()
//     });
//     // let content = "<h4>Information!</h4>";
//     // this.addInfoWindow(marker);
//   }
// getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
// 	var R = 6371; // Radius of the earth in km
// 	var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
// 	var dLon = this.deg2rad(lon2-lon1); 
// 	var a = 
// 	  Math.sin(dLat/2) * Math.sin(dLat/2) +
// 	  Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
// 	  Math.sin(dLon/2) * Math.sin(dLon/2)
// 	  ; 
// 	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
// 	var d = R * c; // Distance in km
// 	return d;
//   }
  
//   deg2rad(deg) {
// 	return deg * (Math.PI/180)
//   }
// 	async loadPrev() {
// 	console.log('Prev');
// 	let newIndex = await this.slider.getActiveIndex();

// 	newIndex++;
// 	this.numbers.unshift(this.numbers[0] - 1);
// 	this.numbers.pop();

// 	// Workaround to make it work: breaks the animation
// 	this.slider.slideTo(newIndex, 0, false);

// 	console.log(`New status: ${this.numbers}`);
// }

// 	async loadNext() {
// 	if(this.firstLoad) {
// 	  // Since the initial slide is 1, prevent the first 
// 	  // movement to modify the slides
// 	  this.firstLoad = false;
// 	  return;
// 	}

// 	console.log('Next');
// 	let newIndex = await this.slider.getActiveIndex();

// 	newIndex--;
// 	this.numbers.push(this.numbers[this.numbers.length - 1] + 1);
// 	this.numbers.shift();

// 	// Workaround to make it work: breaks the animation
// 	this.slider.slideTo(newIndex, 0, false);

// 	console.log(`New status: ${this.numbers}`);
// }
// loadmap_id()
// {
// 	// var maps = document.getElementsByName("map");
// 	// console.log ("Block " + maps.length );
//     //  if (maps.length >= 0) {
//     //     //   if (!this.mapsStartLoaded) {
//     //     //        this.mapsStartLoaded = true;
//     //            this.loadMaps(maps);
//     //      // }
//     //  }
// 	for (let i = 0; i < this.id.length; i++) {
// 		console.log ("Block statement execution no." + this.id[i].Id);
// 		this.loadMaps(this.id[i].Id); 
// 		//if(this.id[i].Id == )
// 		//this.mySlider.slideTo(this.id[i].Id);
// 		//this.slidesDidLoad(this.id[i].Id);
// 	  }
// 	//   this.id.forEach(id1 => {
// 	// 	console.log ("Block statement execution no." + id1);
// 	//   });
// 	// for (var prop in this.id) {
// 	// 	console.log("Key:" + prop);
		
        
//     // }
// }
// ionViewDidEnter(){
// 	this.slides.getSlider().update();
//     this.slides.slideTo(this.currentIndex, 0);
//     console.log("Slides", this.slides);
// }
// slideChanged() {
// 	this.slider .getActiveIndex().then(index => {
// 	  this.segment = index;
// 	});
//   }
  
//   segmentChanged(ev) {
// 	this.slider .slideTo(ev.target.value)
// 	console.log ("Block " + this.slider.slideTo(ev.target.value));
//   }
  loadMaps() {
	
	//for (let i = 0; i <= maps.length; i++) {
	// console.log ("Block " + id);
	// this.loadid = id;
	// create a new map by passing HTMLElement
	// var maps = document.getElementsByName("map");
	//  let mapEle = document.getElementById(maps.getAttribute("id"));
	// var mapDivId = String(id);
	 let mapDivId = 'map1';
	console.log(mapDivId);
	const mapEle: HTMLElement = document.getElementById('map' + mapDivId);
	console.log ("Block " + 'map' + mapDivId);
    // create LatLng object
    const myLatLng = {lat: 26.8819878, lng: 75.7344081};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 16
    });
	//this.directionsDisplay.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers();
      mapEle.classList.add('show-map');
	});
	
	  const flightPath = new google.maps.Polyline({
		path: this.markers,
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	  });
	
	  flightPath.setMap(this.map);
	 // id++;
	//}
  }
//   loadMap1() {
//     // create a new map by passing HTMLElement
//     const mapEle: HTMLElement = document.getElementById('map2');
//     // create LatLng object
//     const myLatLng = {lat: 26.8819878, lng: 75.7344081};
//     // create map
//     this.map = new google.maps.Map(mapEle, {
//       center: myLatLng,
//       zoom: 16
//     });
// 	//this.directionsDisplay.setMap(this.map);
//     google.maps.event.addListenerOnce(this.map, 'idle', () => {
//       this.renderMarkers();
//       mapEle.classList.add('show-map');
// 	});
	
// 	  const flightPath = new google.maps.Polyline({
// 		path: this.markers,
// 		geodesic: true,
// 		strokeColor: "#FF0000",
// 		strokeOpacity: 1.0,
// 		strokeWeight: 2,
// 	  });
	
// 	  flightPath.setMap(this.map);
//   }
//   calc
//   calculateAndDisplayRoute() {
//     const that = this;
//     this.directionsService.route({
//       origin: "jaipur",
//       destination: "goa",
//       travelMode: 'DRIVING'
//     }, (response, status) => {
//       if (status === 'OK') {
//         that.directionsDisplay.setDirections(response);
//       } else {
//         window.alert('Directions request failed due to ' + status);
//       }
//     });
//   }
  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  addMarker(marker: Marker) {
	// return this.map.addPolyline({ 
	// 	points: AIR_PORTS, 
	// 	color: '#AA00FF', 
	// 	width: 10, 
	// 	geodesic: true, 
	// 	clickable: true 
	//  }).then((polyline: Polyline) => { 
	// 	 polyline.on(GoogleMapsEvent.POLYLINE_CLICK).subscribe((params: any) => { 
	// 		 let position: LatLng = <LatLng>params[0]; 
	// 		 this.map.addMarker({ 
	// 			 position: position, 
	// 			 title: position.toUrlValue(), 
	// 			 disableAutoPan: true 
	// 			}).then((marker: Marker) => { 
	// 				marker.showInfoWindow(); }); 
	// 			}); 
	// 		});
    return new google.maps.Marker({
      position: marker,
      map: this.map,
	});
	
  }
//   downloadPdf(pdfUrl: string, pdfName: string ) {
//     //const pdfUrl = './assets/sample.pdf';
// 	//const pdfName = 'your_pdf_file';
// 	console.log(pdfUrl);
//     FileSaver.saveAs(pdfUrl, pdfName);
//   }

//   openDoc(pdfUrl: string, startPage: number ) {
//     window.open(pdfUrl + '#page=' + startPage, '_blank', '', true);
//   }
 
  getPermission() {
	this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE && this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
	  .then(status => {
		if (status.hasPermission) {
		  this.downloadImage();
		} 
		else {
		  this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE && this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
			.then(status => {
			  if(status.hasPermission) {
				this.downloadImage();
			  }
			});
		}
	  });
  }
  downloadImage() {


    this.platform.ready().then(() => {
		let url = encodeURI("http://www.africau.edu/images/default/sample.pdf");
      const fileTransfer: FileTransferObject = this.transfer.create();
	//  this.http.downloadFile(url, {},{},this.file.externalRootDirectory + "DownloadFile.pdf").then((entry)
	fileTransfer.download(url,this.file.externalRootDirectory + "DownloadFile.pdf").then((entry) => {
		console.log("Download Succeeded!" + this.file.externalRootDirectory);
	console.log('download completed: ' + entry.toURL());
	console.log('success block...', entry);
   // open downloaded file 
  // this.downloadFile = entry.toURL();
   this.fileOpener.open(entry.toURL(), 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file', e));
	 }, (error) => {
		  console.log("Download Failed!");
		  console.log('error block ... ', error.status);
       

      });

    });

  }
//   download_dir()
//   {
//     this.platform.ready().then(() => {
// 		let url = "https://zvelo.com/wp-content/uploads/2018/11/anatomy-of-a-full-path-url-hostname-tld-path-protocol.jpg";
//       const fileTransfer: FileTransferObject = this.transfer.create();

//     this.file.createDir(this.file.externalRootDirectory, 'my_downloads', false).then(response => {
// 		console.log('Directory created',response);
// 	//	const fileTransfer: TransferObject = this.transfer.create();
// 	    fileTransfer.download(url,this.file.externalRootDirectory + '/my_downloads/' + "name" + '.jpg').then((entry) => {
// 	    	console.log('file download response',entry);
// 	    })
// 	    .catch((err) =>{
// 	    	console.log('error in file download',err);
// 	    });

// 	}).catch(err => {
// 		console.log('Could not create directory "my_downloads" ',err);
// 	}); 

//     });
// }
// Slider(){
// 	this.api.postApi('getbanners', {userid : '1'}).then((data: any)=> {
// 		console.log('banners', data);
// 			const status= data.status;
// 			if(status == '200'){
// 				this.refresh = this.images = data.data;
// 				this.slidesDidLoad(this.refresh);
// 			}
// 		}).catch(() => {
		
	
// 	});
// }
// slidesDidLoad(mySlider) {
// 	try{
// 		mySlider.startAutoplay();
// 		console.log('slidesdidload' + mySlider);
// 		for (let i = 0; i < this.id.length; i++) {
// 			console.log ("Block statement execution no." + this.id[i].Id);
// 			this.loadMaps(this.id[i].Id);
// 		  }
// 	}
// 	catch
// 	{}
// }

}
