import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '',redirectTo: 'introduction',pathMatch: 'full'},
  {path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'aboutus', loadChildren: './aboutus/aboutus.module#AboutusPageModule' },
  { path: 'mapshow',loadChildren: './mapshow/mapshow.module#MapshowPageModule'},
  { path: 'introduction',loadChildren: './introduction/introduction.module#IntroductionPageModule'},
  { path: 'thankyou',loadChildren: './thankyou/thankyou.module#ThankyouPageModule'},



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
