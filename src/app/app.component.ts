import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform ,NavController, LoadingController, AlertController, MenuController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {firebaseConfig, oneSignalAppId} from './config';
import {USERID} from './environment';
import {ApiService} from './Services/api.service';
import { CategoryPage } from '../app/category/category.page';
import { IntroductionPage } from '../app/introduction/introduction.page';
import {HelperService} from '../app/Services/helper.service';
import { Router } from '@angular/router';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public rootPage: any = IntroductionPage;
  public selectedIndex = 0;
  public appPages = [
    // {
    //   title: 'Home',
    //   url: '/category',
    //   icon: 'home'
    // },
    // {
    //   title: 'about',
    //   url: '/aboutus',
    //   icon: 'home'
    // },
    // {
    //   title: 'introduction',
    //   url: '/introduction',
    //   icon: 'home'
    // },
    // {
    //   title: 'Thank you',
    //   url: '/thankyou',
    //   icon: 'home'
    // }
  ];
  locationCoords: any;
  timetest: any;
  constructor(
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private storage: Storage,
    public navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private api: ApiService,
    public loadingCtrl: LoadingController,
    private helper: HelperService,
    private ngZone: NgZone,
    private alertDialog: AlertController,
    private router: Router,
    public menu: MenuController,
  ) {
    this.initializeApp();
    this.menu.enable(false);
    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.timetest = Date.now();
    this.platform = platform;
  }

  initializeApp() {
 
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString( '#000000');
      this.splashScreen.hide();
      // this.filePermission();
      if (this.platform.is('cordova')){
      //  this.checkGPSPermission();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      );
      
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
      // this.storage.remove(latitude);
      // this.storage.remove(longitude);
      // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
      //   result => console.log('Has permission?',result.hasPermission),
      //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
      // );
      }
     
    });

  }
  filePermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    );

  }
  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              //this.router.navigate(['aboutus']);
               console.log("resp" );
             // alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      
      error => 
      { 
      //  this.exitApp();
       // this.router.navigate(['aboutus']);
        console.log("resp" );}
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.storage.set('latitude', resp.coords.latitude);
      this.storage.set('longitude', resp.coords.longitude);

    
     console.log(resp);
     
      
     // this.helper.pushPage('/category', resp.coords.latitude).catch(() => {});
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
    }).catch((error) => {
      
     // alert('Error getting location' + error);
    });
  }
 exitApp(){
 
    navigator['app'].exitApp();
    // or trigger any action you want to achieve
    
  }
  
  async presentLoadingDefault() {
    var loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      showBackdrop: true
    });
    return await loading.present();
  }
  
}
