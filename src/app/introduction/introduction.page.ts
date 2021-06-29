import { Component, OnInit } from '@angular/core';
import {HelperService} from '../Services/helper.service';
import {
  //	Platform,
    NavController,
    LoadingController,
    IonSlides,
    AlertController,IonSelect,MenuController, IonRouterOutlet, 
  } from '@ionic/angular';
@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.page.html',
  styleUrls: ['./introduction.page.scss'],
})
export class IntroductionPage implements OnInit {

  constructor(private helper: HelperService,public menu: MenuController, private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
     this.routerOutlet.swipeGesture = false;
  }
  nextpage()
  {
    this.helper.pushPage('/category').catch(() => {});
  }
  ionViewWillEnter() {
    // console.log('ionViewDidLoad CartPage');
   
     this.menu.enable(false);
 this.routerOutlet.swipeGesture = false;
}
ionViewDidEnter(){
  this.menu.enable(false);
   this.routerOutlet.swipeGesture = false;
}

ionViewWillLeave(){
  this.menu.enable(false);
   this.routerOutlet.swipeGesture = false;
} 
}
