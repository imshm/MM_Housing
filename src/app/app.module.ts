import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';

import {Toast} from '@ionic-native/toast/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {DatePipe} from '@angular/common';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer ,FileTransferObject} from '@ionic-native/file-transfer/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import { DecimalPipe } from '@angular/common';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),
  ],
  providers: [
    {provide: ErrorHandler},
    HTTP,DecimalPipe,
    NativeGeocoder, 
    UniqueDeviceID,
    FileOpener,
    File,
    FileTransferObject,
    FileTransfer,
   GoogleMaps,
    Geolocation,
    AndroidPermissions,
    LocationAccuracy,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     Toast, Keyboard, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
