import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapshowPageRoutingModule } from './mapshow-routing.module';

import { MapshowPage } from './mapshow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapshowPageRoutingModule
  ],
  declarations: [MapshowPage]
})
export class MapshowPageModule {}
