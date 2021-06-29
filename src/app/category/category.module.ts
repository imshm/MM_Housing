import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CategoryPage } from './category.page';
import {intersectionObserverPreset, LazyLoadImageModule} from 'ng-lazyload-image';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LazyLoadImageModule.forRoot({preset: intersectionObserverPreset}),

  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
