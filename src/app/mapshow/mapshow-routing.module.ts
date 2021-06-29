import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapshowPage } from './mapshow.page';

const routes: Routes = [
  {
    path: '',
    component: MapshowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapshowPageRoutingModule {}
