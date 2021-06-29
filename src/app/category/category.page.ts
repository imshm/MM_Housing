import { Component, OnInit, ViewChild, NgZone, Renderer2, ElementRef } from '@angular/core';
import {NavController, LoadingController, IonSlides, AlertController, IonSelect, MenuController, Platform, IonRouterOutlet} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import {ApiService} from '../Services/api.service';
import _ from 'lodash';
import {HelperService} from '../Services/helper.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';
import { ModalController, IonContent } from '@ionic/angular';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})

export class CategoryPage implements OnInit {
  @ViewChild('pageTop') pageTop: IonContent;
  @ViewChild('mySelect') selectRef: IonSelect;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild('slider') private slider: IonSlides;

  locationCoords: any;
  id: any;
  score = 0;
  currentQuestion = 1;
  questionList = [];
  showsubcat: any;
  selectedArray: any = [];
  ques: any = { seq: '', answerFilled: ''};

  questionData: any = [];
  data: any;
  row: any;
  show = true;
  count: number;
  another_questionList: any = [];
  another_questionList_rel: any = [];
  showradio: boolean;
  add: any;
  address: string;
  latitude: number;
  longitude: number;
  showfooter = false;
  categorywithqestions: any = [];
  returnid: any;
  data1: any;
  myInputs: any;
  title: any;
  relatedquestions: any = [];
  tempArray2: any = [];
  filteredKeywords: any[];
  show_sign = false;
  score_new_value: any;
  title_box: string;
  value: any;
  add_value: number;
  alert = false;
  location: any;
  option: void;
  isLoading = false;
  constructor(
    private decimalPipe: DecimalPipe,
    private sanitizer: DomSanitizer,
    private routerOutlet: IonRouterOutlet,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private storage: Storage,
    private api: ApiService,
    public loadingCtrl: LoadingController,
    private helper: HelperService,
    public menu: MenuController,
    private nativeGeocoder: NativeGeocoder,
  ) {
    this.menu.enable(false);
    this.locationCoords = {
      latitude: '',
      longitude: '',
      accuracy: '',
      timestamp: ''
    };
    this.storage.remove('_SCORE_DATA');

  }
  backButtonEvent(){
    this.platform.backButton.subscribe(() => {
      // console.log ('exit');
      // navigator.app.exitApp();
    });
  }

  ngOnInit()
  {
    this.routerOutlet.swipeGesture = false;
    this.storage.remove('_SCORE_DATA');
    this.platform.backButton.subscribeWithPriority(10, () => {});
  }
  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html) ;
  }
  ionViewWillEnter() {

    this.routerOutlet.swipeGesture = false;
    // console.log('ionViewDidLoad CartPage');
    // this.initi();
    this.currentQuestion = 1;
    this.menu.enable(false);
    // this.showradio = true;

  }
  ionViewDidEnter(){
    this.routerOutlet.swipeGesture = false;
    this.menu.enable(false);
    // this.menu.swipeGesture(false);
  }

  ionViewWillLeave(){
    this.menu.enable(false);
    this.routerOutlet.swipeGesture = false;
  }

  initi(latitude_origin, longitude_origin)
  {
    this.presentLoadingDefault_init();
    const body = {
      latitude_origin,
      longitude_origin
    };
    //  console.log("categoryquestion" , body );
    this.api.postApi('categoryquestion', body).then( (data: any) => {    // all complaint listing
      const status = data.status || false;
      if (status == '200'){
        this.loadingCtrl.dismiss().catch(() => {});
        //  console.log("categoryquestion" , JSON.parse(JSON.stringify(data.data)) );
        this.questionData = data.data;
        this.count = Object.keys( this.questionData).length;
        // console.log(this.count );
        //  this.questionList = this.questionData;
        this.custom_api(this.questionData);

      }
    }).catch(() => { //  console.log("category" );
    });
  }
// custom category question array
  custom_api(arr1)
  {
    let found;
    let result2: any = [];
    const result_new: any = [];
    const result: any = [];
    let k = 0;
    let app_ques_id = 1;
    for (let j = 0; j < arr1.length; j++)
    {
      result2 = arr1[j].categorywithqestions;
      for (let i = 0; i < result2.length; i++)
      {

        if (result2[i].relatedquestions == '')
        {
          found = true;
          k++;
          if (arr1[j].options_detail == '(select one)')
          {
            result_new.push({
              new_id: app_ques_id,
              id: arr1[j].id,
              multiple: 0,
              j: k,
              options: arr1[j].options,
              new_page: 0,
              refs_info: arr1[j].refs_info,
              title: arr1[j].title,
              description: arr1[j].description,
              options_detail: '',
              active: arr1[j].active,
              inactive: arr1[j].inactive,
              created_at: arr1[j].created_at,
              updated_at: arr1[j].updated_at,
              categorywithqestions: [result2[i]],

            });
          }
          else{
            result_new.push({
              new_id: app_ques_id,
              id: arr1[j].id,
              multiple: 0,
              j: k,
              options: arr1[j].options,
              new_page: 0,
              refs_info: arr1[j].refs_info,
              title: arr1[j].title,
              description: arr1[j].description,
              options_detail: arr1[j].options_detail,
              active: arr1[j].active,
              inactive: arr1[j].inactive,
              created_at: arr1[j].created_at,
              updated_at: arr1[j].updated_at,
              categorywithqestions: [result2[i]],

            });
          }
        }
        else
        {
          found = false;
          result.push({
            new_id: app_ques_id,
            id: arr1[j].id,
            multiple: 1,
            j: k,
            options: arr1[j].options,
            new_page: 1,
            refs_info: arr1[j].refs_info,
            title: arr1[j].title,
            description: arr1[j].description,
            options_detail: arr1[j].options_detail,
            active: arr1[j].active,
            inactive: arr1[j].inactive,
            created_at: arr1[j].created_at,
            updated_at: arr1[j].updated_at,
            categorywithqestions: [result2[i]],

          });
        }

        // k++;
      }
      app_ques_id++;
    }
    const arrayHashmap = result_new.reduce((obj, item) => {
      obj[item.id] ? obj[item.id].categorywithqestions.push(...item.categorywithqestions) : (obj[item.id] = { ...item });
      return obj;
    }, {});
    const mergedArray = Object.values(arrayHashmap);
    const resultArr = [...mergedArray, ...result];
    // resultArr.sort((a,b)=> a.id-b.id); //arrange by id
    resultArr.sort((a, b) => a.j - b.j);       // arrange by ques coming
    this.count = Object.keys( resultArr).length;
    console.log('this.count ', resultArr);
    this.questionList = resultArr;
    this.loadQuestion(this.currentQuestion);


    return found;
  }

  getApiData(title, qType, latitude, longitude) {
    return new Promise(resolve => {
      this.helper.presentLoadingWithOptions().catch(() => {});
      const body = {
        latitude_origin: latitude,
        longitude_origin: longitude,
        title_dont_ask: title,
        qtype: qType
      };
      this.api.postApi('categoryquestion_googleapi', body).then((res: any) => {
        this.helper.dismissLoading();
        if (res && res.status && res.status == 200 && res.data) {
          return resolve(res.data);
        } else {
          return resolve(null);
        }
      }).catch( async (err) => {
        this.helper.dismissLoading();
        return resolve(null);
      });
    });
  }
  async loadQuestion(currentQuestion) {
    this.tempArray2 = [];
    this.alert = true;
    this.showfooter = false;
    this.currentQuestion = currentQuestion;
    const ques = this.questionList[currentQuestion - 1];
    const quesCat = ques?.categorywithqestions;
    for (const q of quesCat) {
      if (q.q_type === 'dont_ask' && !q.api_response) {
        q.api_response = await (this.getApiData(q.title, q.q_type, this.locationCoords.latitude, this.locationCoords.longitude));
      } else {
        this.ques = ques;
      }
    }
  }
// question load
  async loadQuestionOld(currentQuestion){
    // console.log ('exit');
    for (let i = 0; i <= this.tempArray2.length; i++) {
      this.tempArray2.pop();
      // if(this.tempArray2.length == '')
      // {
      //   this.show_sign = true;
      // }
    }
    this.alert = true;
    this.presentLoadingDefault1();
    this.showfooter = false;
    this.currentQuestion = currentQuestion;
    const ques = this.questionList[this.currentQuestion - 1];

    for (let l = 0; l <= ques.categorywithqestions.length; l++)
    {
      const qtype = ques.categorywithqestions[l];
      //  var count_direct_ask= qtype.length;
      //  console.log("errorelse", count_direct_ask ,ques.categorywithqestions[l]);
      try{
        if (qtype.q_type === 'dont_ask')
        {

          if (qtype.api_response == null)
          {

            await this.new_fun(ques.categorywithqestions[l], qtype.title, qtype.q_type, this.locationCoords.latitude,
              this.locationCoords.longitude , currentQuestion);
          }

          else
          {
            await this.dismiss().catch(() => {});
            this.ques = this.questionList[this.currentQuestion - 1];
            console.log('errorelse', this.ques);
            // }
          }


        }
        else if (qtype.q_type === 'direct_ask' || qtype.q_type === 'indirect_ask')
        {
          // await this.loadingCtrl.dismiss().catch(() => {});
          this.ques = this.questionList[this.currentQuestion - 1];
        }
        else
        {
          this.ques = this.questionList[this.currentQuestion - 1];
        }
      }
      catch (err)
      {
        // console.log("error", err);
        this.loadingCtrl.dismiss().catch(() => {});
      }

    }

  }
  loadQuestion_previous(currentQuestion){
    console.log ('exit');
    for (let i = 0; i <= this.tempArray2.length; i++) {
      this.tempArray2.pop();
    }
    this.alert = true;
    this.presentLoadingDefault1();
    this.showfooter = false;
    this.currentQuestion = currentQuestion;
    // var ques = this.questionList[this.currentQuestion];
    this.ques = this.questionList[this.currentQuestion - 1];

  }
  async new_fun(full_ques, title, q_type, latitude, longitude, currentQuestion)
  {
    await this.present().catch(() => {});

    const body = {
      latitude_origin: latitude,
      longitude_origin: longitude,
      title_dont_ask: title,
      qtype: q_type
    };
    this.api.postApi('categoryquestion_googleapi', body).then(async (data: any) => {    // all complaint listing
      const status = data.status || false;
      if (status == '200'){
        if (JSON.parse(JSON.stringify(data.data)) == null)
        {
          await this.dismiss().catch(() => {});
        }
        else
        {
          await this.dismiss().catch(() => {});
          full_ques.api_response = JSON.parse(JSON.stringify(data.data));
        }
      }
      else
      {
        await this.dismiss().catch(() => {});
      }
    }).catch( async (err) => {
      // console.log("error", err);
      await this.dismiss().catch(() => {});
    });
  }
  async present() {
    this.isLoading = true;
    return  await this.loadingCtrl.create({
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
  async presentLoadingDefault1() {
    const loading = await this.loadingCtrl.create({

      message: 'Please wait for a moment...',
      translucent: true,
      spinner: 'crescent',
      showBackdrop: true,
      cssClass: 'loader',
      duration: 100

    });
    return await loading.present();
  }
  // scroll to page top
  public pageScroller(){

    this.pageTop.scrollToTop();
  }
// previous button
  previousQuestion(currentQuestion){
    this.showfooter = false;
    this.alert = true;
    // console.log("category previous" + currentQuestion );
    if (currentQuestion > 1)
    {
      --currentQuestion;
      //  console.log("category previous" + currentQuestion );
      for (let i = 0; i <= this.tempArray2.length; i++) {
        this.tempArray2.pop();
        if (this.tempArray2.length == '')
        {
          this.show_sign = true;
        }
      }
      this.currentQuestion = currentQuestion;
      //  console.log("this.tempArray2"+  this.tempArray2);
      if (this.tempArray2.length == '')
      {
        this.show_sign = true;
      }
      // this.loadQuestion(this.currentQuestion);
      this.loadQuestion_previous(this.currentQuestion);
    }
    this.pageScroller();
  }
// old way next button
  nextQuestion_old(currentQuestion){
    this.showfooter = false;
    // this.storage.remove('_SCORE_DATA');
    if (currentQuestion < this.questionList.length){
      ++currentQuestion;
      this.currentQuestion = currentQuestion;
      // console.log("category next" + this.currentQuestion);
      this.loadQuestion(this.currentQuestion);
      this.selectedAnswer();
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.score += this.selectedArray[i];
        // console.log( this.score);
      }
    }
  }
// next question
  nextQuestion(currentQuestion)
  {
    const tempArray1: any = [];
    let option: any;
    let multiple: any;
    this.showfooter = false;
    this.alert = true;
    //  console.log(currentQuestion ,this.questionList ,this.ques);
    // if(currentQuestion == this.ques.id)
    // {
    //  console.log("category" + this.ques.options);
    option =  this.ques.options;
    // console.log("category" + this.ques.multiple);
    multiple = this.ques.multiple;
    // console.log("show" );
    this.ques.categorywithqestions.map((item) => {
      this.another_questionList = item.id;
      // console.log("category" + item.id);

      if (item.relatedquestions == '')
      {
        tempArray1.push(this.another_questionList);
      }
      else{
        item.relatedquestions.map((item1) => {
          this.another_questionList_rel = item1.id;
          // console.log("category" + item.id);
          tempArray1.push(this.another_questionList);
          tempArray1.push(this.another_questionList_rel);
          // console.log("tempArray categorywithqestions " + tempArray1);
        });
        // tempArray1.push(this.another_questionList);
      }
      // console.log("tempArray categorywithqestions " + tempArray1);
    });
    const tempArray2 = [...tempArray1].sort();
    const tempArray = [...this.tempArray2].sort();
    // console.log('tempArray,tempArray2!' ,tempArray2,tempArray);
    // for only 15 and 20 questions
    if ((option == 1 ) && (multiple == 0))
    {
      this.show_sign = false;
      if ( this.hasCommonNumbers(tempArray2, tempArray))
      {
        this.nextQuestion_page(currentQuestion);
        // console.log('They are equal remaining!' ,option,multiple);
        for (let i = 0; i <= this.tempArray2.length; i++) {
          this.tempArray2.pop();
          if (this.tempArray2.length == '')
          {
            this.show_sign = true;
          }
        }
      }
      else
      {
        const unique = tempArray.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });
        this.filteredKeywords = tempArray2.filter((word) => !unique.includes(word));
        // console.log("not equal" );
        alert('Please make sure you answered only one question on the page');
      }
      // console.log(this.hasCommonNumbers(tempArray,tempArray));
      // console.log('They are equal for 15 and 20!' ,option,multiple);
    }
    // one page for questions 1,6,19,21
    else if ((option == 0 ) && (multiple == 1))
    {
      this.show_sign = false;
      if (this.hasCommonNumbers(tempArray2, tempArray))
      {
        this.nextQuestion_page(currentQuestion);
        // console.log('They are equal remaining!' ,option,multiple);
        for (let i = 0; i <= this.tempArray2.length; i++) {
          this.tempArray2.pop();
          if (this.tempArray2.length == '')
          {
            this.show_sign = true;
          }
        }
      }
      else
      {
        const unique = tempArray.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });
        this.filteredKeywords = tempArray2.filter((word) => !unique.includes(word));
        // console.log("not equal" );
        alert('Please make sure you answered only one question on the page' ) ;
      }
      // console.log(this.hasCommonNumbers(tempArray,tempArray));
      // console.log('They are equal for 1,6,19,21!' ,option,multiple);
    }
    // remaining questions
    else if ((option == 0 ) && (multiple == 0))
    {
      this.show_sign = false;
      const unique = tempArray.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      });
      // console.log('tempArray,tempArray2!' ,unique ,tempArray2);
      const array1 = tempArray2.filter(val => unique.includes(val));
      // console.log("remove common",array1);
      // JSON.stringify(tempArray2) === JSON.stringify(unique)
      if (JSON.stringify(tempArray2) === JSON.stringify(array1)) {
        // console.log('They are equal!');
        this.nextQuestion_page(currentQuestion);
        // console.log('They are equal remaining!' ,option,multiple);
        for (let i = 0; i <= this.tempArray2.length; i++) {
          this.tempArray2.pop();
          if (this.tempArray2.length == '')
          {
            this.show_sign = true;
          }
        }
      }
      else
      {
        this.filteredKeywords = tempArray2.filter((word) => !unique.includes(word));
        alert('Please make sure you answered every question on the page');
      }

    }
  }
  nextQuestion_page(currentQuestion)
  {
    this.show_sign = false;
    if (currentQuestion < this.questionList.length){
      ++currentQuestion;
      this.currentQuestion = currentQuestion;
      // console.log("category next" + this.currentQuestion);
      this.loadQuestion(this.currentQuestion);
      for (let i = 0; i <= this.tempArray2.length; i++) {
        this.tempArray2.pop();


      }
      this.selectedAnswer();
      this.pageScroller();
      for (let i = 0; i < this.selectedArray.length; i++) {
        this.score += this.selectedArray[i];
        // console.log( this.score);
      }
    }
  }
// complete submit
  completeTest(ques_id)
  {
    const tempArray1: any = [];
    let option: any;
    let multiple: any;
    this.showfooter = false;
    const another_questionList_rel: any = [];
    let another_questionList: any = [];
    //  console.log(currentQuestion ,this.questionList ,this.ques);
    if (ques_id == this.ques.id)
    {
      // console.log("category" + ques_id,this.ques.id);
      option =  this.ques.options;
      // console.log("category" + this.ques.multiple);
      multiple = this.ques.multiple;
      // console.log("show" );
      this.ques.categorywithqestions.map((item) => {
        another_questionList = item.id;
        tempArray1.push(another_questionList);
        // }
        // console.log("tempArray categorywithqestions " + tempArray1);
      });
      const tempArray2 = [...tempArray1].sort();
      const tempArray = [...this.tempArray2].sort();
      // console.log('tempArray,tempArray2!' ,tempArray2,tempArray);
      // for only 15 and 20 questions
      if ((option == 1 ) && (multiple == 0))
      {
        this.show_sign = false;
        if ( this.hasCommonNumbers(tempArray2, tempArray))
        {
          this.completeTest_page();
          // console.log('They are equal remaining!' ,option,multiple);
          for (let i = 0; i <= this.tempArray2.length; i++) {
            this.tempArray2.pop();
            if (this.tempArray2.length == '')
            {
              this.show_sign = true;
            }
          }
        }
        else
        {
          const unique = tempArray.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
          });
          this.filteredKeywords = tempArray2.filter((word) => !unique.includes(word));
          // console.log("not equal" );
          alert('Please make sure you answered only one question on the page');
        }
        // console.log(this.hasCommonNumbers(tempArray,tempArray));
        // console.log('They are equal for 15 and 20!' ,option,multiple);
      }
      // one page for questions 1,6,19,21
      else if ((option == 0 ) && (multiple == 1))
      {
        this.show_sign = false;
        if (this.hasCommonNumbers(tempArray2, tempArray))
        {
          this.completeTest_page();
          // console.log('They are equal remaining!' ,option,multiple);
          for (let i = 0; i <= this.tempArray2.length; i++) {
            this.tempArray2.pop();
            if (this.tempArray2.length == '')
            {
              this.show_sign = true;
            }
          }
        }
        else
        {
          const unique = tempArray.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
          });
          this.filteredKeywords = tempArray2.filter((word) => !unique.includes(word));
          // console.log("not equal" );
          alert('Please make sure you answered only one question on the page' ) ;
        }
        // console.log(this.hasCommonNumbers(tempArray,tempArray));
        // console.log('They are equal for 1,6,19,21!' ,option,multiple);
      }
      // remaining questions
      else if ((option == 0 ) && (multiple == 0))
      {
        this.show_sign = false;
        const unique = tempArray.filter(function(elem, index, self) {
          return index === self.indexOf(elem);
        });
        // console.log('tempArray,tempArray2!' ,unique ,tempArray2);
        const array1 = tempArray2.filter(val => unique.includes(val));
        // console.log("remove common",array1);
        // JSON.stringify(tempArray2) === JSON.stringify(unique)
        if (JSON.stringify(tempArray2) === JSON.stringify(array1)) {
          // console.log('They are equal!');
          this.completeTest_page();
          // console.log('They are equal remaining!' ,option,multiple);
          for (let i = 0; i <= this.tempArray2.length; i++) {
            this.tempArray2.pop();
            if (this.tempArray2.length == '')
            {
              this.show_sign = true;
            }
          }
        }
        else
        {
          this.filteredKeywords = tempArray2.filter((word) => !unique.includes(word));
          alert('Please make sure you answered every question on the page');
        }

      }
    }
  }
// submit buton
  completeTest_page(){
    this.showfooter = false;
    // this.selectedAnswer();
    this.data = [{latitude: this.locationCoords.latitude ,
      longitude: this.locationCoords.longitude, user_id: 1}];
    this.helper.pushPage('/aboutus', this.data).catch(() => {});
  }

  hasCommonNumbers(arr1, arr2) {
    let found = false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) !== -1) {
        found = true;
        // console.log( arr2.indexOf(arr1[i]));
        break;
      }
    }
    return found;
  }
// if calculate score but at this time scoring is calutlated via backend
  selectedAnswer(){
    this.score = 0;
    this.questionList.forEach((item) => {
      // console.log("ques"+ JSON.stringify(item));
      this.showsubcat = _.filter(_.toArray(item.options), (item1, key) => {
        return ( item.answerFilled == item1.seq);
      });
      for (let i = 0; i < this.showsubcat.length; i++) {
        this.row = this.showsubcat[i].score;
        this.score = this.score + this.row;
        // console.log(this.score);
      }
    });
  }
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.show = false;
          // If having permission show 'Turn On GPS' dialogue --hasPermission==true
          this.askToTurnOnGPS();
          //  console.log("resp1" , result.hasPermission);
        } else {
          // console.log("resp2", result.hasPermission);
          // If not having permission ask for permission user first time in app --hasPermission==false
          this.requestGPSPermission();

        }
      },
      err => {
        // this.requestGPSPermission();
        //  console.log("resp22", err);
        // alert(err);
      }
    );
  }
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.askToTurnOnGPS();
        //  console.log("resp3");
      } else {
        // Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // console.log("resp4");
              // call method to turn on GPS
              this.askToTurnOnGPS();
              // console.log("resp" );
            },
            error => {
              // console.log("resp5",error);
              this.requestGPSPermission();
              // Show alert if user click on 'No Thanks'
              // this.router.navigate(['aboutus']);
              //  console.log("resp" );
              // alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.show = false;
        // console.log("resp6",this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates();
      },
      error =>
      {
        this.show = true;
        // console.log("resp7",error);
        alert('Location access has been denied. Change your setting > this app > Allow Location access is set to be Always.');
        // 	this.exitApp();
        // this.checkGPSPermission();
        // this.router.navigate(['aboutus']);
        // console.log("resp1" );
      }
    );
  }
  async presentuserlocation(message, location) {

    const alert = await this.alertCtrl.create({
      header: 'Enter your address',
      cssClass: 'my-custom-class',
      message,
      inputs: [
        {
          type: 'textarea',
          name: 'location',
          placeholder: 'Enter your full address.',
          value : location
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (this.isValidate(data.location).isValid) {
              // this.location = data.location;
              //  console.log('data.location' ,data.location);
              this.getuserlocation(data.location);
              return true;
            } else {
              alert.message = this.isValidate(data.location).message;
              return false;
            }
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }
  isValidate(location) {
    location = location.trim();
    if ( location){
      return {
        isValid: true,
        message: ''
      };
    }
    else {
      return {
        isValid: false,
        message: 'Address not empty.'
      };
    }
  }
  getuserlocation(location)
  {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(location, options)
      .then((result: NativeGeocoderResult[]) =>
      {
        // console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude)
        // console.log("result" ,  result);

        // console.log("result" ,  this.locationCoords.latitude , this.locationCoords.longitude);
        if (result[0].latitude && result[0].longitude)
        {
          this.presentAlert(location , result[0].latitude, result[0].longitude);
        }

      })
      .catch((error: any) => {
        // console.log(error)
        this.presentuserlocation('Cannot find a location.Please Enter your address.', location);
        // alert(error + 'Please Enter your address or choose your current loaction.');
      });

  }
  async presentAlert(location, latitude, longitude) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Edit your address or proceed to click ok.',
      // subHeader: 'Subtitle',
      message: location,
      buttons: [
        {
          text: 'Edit',
          role: 'Edit',
          cssClass: 'secondary',
          handler: () => {
            this.presentuserlocation('', location);
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            // console.log('Confirm Ok');
            this.locationCoords.latitude = latitude;
            this.locationCoords.longitude = longitude;
            this.show = false;
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }
  forward()
  {

  }
// Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      // console.log("result" ,  resp);
      this.initi(this.locationCoords.latitude, this.locationCoords.longitude);
    }).catch((error) => {
      const error2 = error;
      this.show = true;
      alert('Location access has been denied. Change your setting > this app > Allow Location access is set to be Always.');
      // this.checkGPSPermission();
      // alert('Error getting location' + error2);
    });
  }
  async presentLoadingDefault_init() {
    const loading = await this.loadingCtrl.create({

      message: 'Please wait for a moment...',
      translucent: true,
      spinner: 'crescent',
      showBackdrop: true,
      cssClass: 'loader',
      duration: 3000

    });
    return await loading.present();
  }


  async presentLoadingDefault3() {
    const loading = await this.loadingCtrl.create({

      message: 'Please wait for a moment...',
      translucent: true,
      spinner: 'crescent',
      showBackdrop: true,
      cssClass: 'loader',
      // duration: 5000

    });
    return await loading.present();
  }

  addTonew(data, inc = true) {
    // data.value = (data.value ? data.value : 'yes') + (inc ? 'yes' : 'no');
    this.storage.get('_SCORE_DATA').then((strval) => {
      // if (strval) {
      let tempArray: any = [];
      // console.log('data', data);
      //  this.tempArray2.push(data.id);
      tempArray = _.filter(strval, fv => {


        if ((fv.id != data.id) )
        {
          if (fv.question_id == data.question_id )
          {
            // console.log("hello questionid");
            return fv.cat !== data.cat;
          }
          else if (data.question_id == '')
          {
            // console.log("hello question_id is equal to null");
            return fv.cat !== data.cat;
          }
          else{
            // console.log("hello id and cat");
            return fv.id !== data.id;
          }
        }
        else if (fv.cat != data.cat)
        {
          // console.log("hello cat");
          return fv.cat !== data.cat;
        }
        else{
          // console.log("hello new cat");
          return fv.question_id !== data.question_id;
        }



      });
      tempArray.push(data);
      this.tempArray2.push(data.id);

      this.storage.remove('_SCORE_DATA');
      this.storage.set('_SCORE_DATA', tempArray);

    }).catch(() => {});
  }

  async presentAlertRadio(event) {
    // this.id = event.target.value;
    this.id = event;
    // console.log("id",this.id,event);
    this.myInputs = this.createInputs();
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Please Select',
      inputs: this.myInputs,
      mode: 'md',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.data1  = data.id;
            this.title  = data.title;
            this.selectedOption(this.data1);
            // console.log('Confirm Ok',data);
          }
        }
      ]
    });

    await alert.present();
  }
  selectedOption(local){
    // this.add = local.target.value;
    this.add = local;
    this.showradio = true;
    // console.info("Selected:",local);
    // console.log("hello" ,this.add)
  }
  createInputs()
  {
    const theNewInputs = [];
    for (let i = 0; i < this.questionData.length; i++)
    {
      if (this.questionData[i].id == this.currentQuestion)
      {
        //  console.log(this.questionData[i].id , this.currentQuestion)
        this.categorywithqestions = this.questionData[i].categorywithqestions;
        for (let j = 0; j < this.categorywithqestions.length; j++)
        {
          if (this.categorywithqestions[j].id == this.id)
          {
            //  console.log(this.categorywithqestions[j].id  , this.id)
            theNewInputs.push(
              {
                name: this.categorywithqestions[j].title,
                type: 'radio',
                label: this.categorywithqestions[j].title,
                value: this.categorywithqestions[j],
                // checked: false
              },
            );
            this.relatedquestions = this.categorywithqestions[j].relatedquestions;
            for (let k = 0; k < this.relatedquestions.length; k++)
            {
              if (this.relatedquestions[k].question_id == this.categorywithqestions[j].id)
              {
                // console.log(this.relatedquestions[k].question_id  , this.categorywithqestions[j].id)
                theNewInputs.push(
                  {
                    name: this.relatedquestions[k].title,
                    type: 'radio',
                    label: this.relatedquestions[k].title,
                    value: this.relatedquestions[k],
                    // checked: false
                  },
                );
              }
            }
          }
        }
      }
      else
      {
        //  console.log("else",this.questionData[i].id , this.currentQuestion)
      }
    }
    return theNewInputs;
  }
  information_show(id){
    this.showfooter = true;
    this.returnid = (id.detail).replace(/\r\n\r\n/g, '<br />');
    // this.returnid = id;
    // console.log("information according to id.", id);
  }
  close(){
    this.showfooter = false;
  }
// reaming question multiple 0 and option 0
  radioGroupChange(event, option) {
    // console.log("hello");
    // console.log("radioGroupChange",event,option);
    this.showfooter = false;
    // let myItems;
    // console.log("radioSelect",option.id,option.cat,option.score,event.detail.value,option.id,option.q_type);
    if (((option.id == 1) || (option.id == 19) || (option.id == 61)) && (event.detail.value == 'yes'))
    {
      this.value = event.detail.value;
      // console.log('score' ,this.value,option);
      //  this.alert = false;
      this.presentPrompt(this.value, option, this.alert = false);
      const myItems = {
        id: option.id,
        cat:  option.cat,
        score: this.score_new_value,
        value:  this.value,
        question_id: option.id,
        q_type: option.q_type,
        title: this.ques.title,
        ques_title: option.title
      };
      console.log('myItems' , myItems);
      this.addTonew(myItems);
    }
    else
    {
      const myItems = {
        id: option.id,
        cat:  option.cat,
        score: option.score,
        value:  event.detail.value,
        question_id: option.id,
        q_type: option.q_type,
        title: this.ques.title,
        ques_title: option.title
      };
      this.alert = true;
      this.addTonew(myItems);
    }

  }
  async presentPrompt(value, option, alertbox) {

    if (option.id == 1)
    {
      this.title_box = 'How many highways is it within 7 miles of?';
      this.add_value = 3;
    }
    else if (option.id == 19)
    {
      this.title_box = 'How many neighbors?';
      this.add_value = -1;
    }
    else if (option.id == 61)
    {
      this.title_box = 'How many do?';
      this.add_value = -1;
    }
    const alert = await this.alertCtrl.create({
      header: this.title_box,
      cssClass: 'alert-prompt',
      message: '',
      inputs: [
        {
          type: 'number',
          name: 'username',
          placeholder: 'Enter your value.'
        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            if (this.isValid(data.username).isValid) {
              this.score_new_value = data.username;
              this.score_new_value = (this.add_value * this.score_new_value);
              console.log('score' , this.score_new_value);
              // console.log("data.username",data.username);
              const myItems = {
                id: option.id,
                cat:  option.cat,
                score: this.score_new_value,
                value:  value,
                question_id: option.id,
                q_type: option.q_type,
                title: this.ques.title,
                ques_title: option.title
              };
              console.log('myItems' , myItems);
              this.alert = false;
              this.addTonew(myItems);
              return true;
            } else {
              alert.message = this.isValid(data.username).message;
              return false;
            }
          }
        }
      ],
      backdropDismiss: false
    });
    console.log('alert', alertbox);
    if (this.alert == false)
    {
      this.alert = true;
      await alert.present();
    }
    else if (this.alert == true)
    {
      this.alert = false;
      await alert.onDidDismiss();
    }
  }
  isValid(data) {
    const pattern = /^\-?\d+((\.|\,)\d+)?$/;
    const pattern2 = /^[0]*?(([1-9][0-9]*)?[0-9](\.[0]*)?|\.[0]+)$/;
    data = data.trim();
    if ( data){
      if (pattern.test(data) && pattern2.test(data) && (data <= 10 && data > 0)){
        return {
          isValid: true,
          message: ''
        };
      }
      else
      {
        return {
          isValid: false,
          message: 'Data must be 1 to 10 or not include decimals digits.'
        };
      }
    }
    else {
      return {
        isValid: false,
        message: 'Data not empty.'
      };
    }
  }
  radioGroupChange1(event, option, cat, q_type) {
    this.showfooter = false;
    const myItems = {
      id: option.id,
      cat:  cat,
      score: option.score,
      value:  event.detail.value,
      question_id: option.question_id,
      q_type: option.q_type
    };
    this.addTonew(myItems);
  }
  radioGroupChange2(event)
  {
    this.add = event.detail.value;
    this.showradio = true;
  }
  radioGroupChange3(event, option, option_rel)
  {
    this.showfooter = false;
    const number_parsed: number = +event.detail.value;
    let myItems;
    if (option.id == event.detail.value)
    {
      myItems = {
        id: number_parsed,
        cat:  option.cat,
        score: option.score,
        value:  'yes',
        question_id: option.id,
        q_type: option.q_type,
        title: this.ques.title,
        ques_title: option.title
      };
    }
    else if (option_rel.id == event.detail.value)
    {
      myItems = {
        id: number_parsed,
        cat:  option.cat,
        score: option_rel.score,
        value:  'yes',
        question_id: option_rel.question_id,
        q_type: option.q_type,
        title: this.ques.title,
        ques_title: option_rel.title
      };
    }
    else if (event.detail.value == 'neither')
    {
      myItems = {
        id:  option.id,
        cat:  option.cat,
        score: 0,
        value:  'no',
        question_id: option.id,
        q_type: option.q_type,
        title: this.ques.title,
        ques_title: option.title
      };
    }
    this.addTonew(myItems);
  }
  radioGroupChange4(event)
  {
    this.ques.categorywithqestions.map((item) => {
      if (item.id == event.detail.value)
      {
        let myItems;
        console.log('this side' , item);
        myItems = {
          id: item.id,
          cat:  item.cat,
          score: item.score,
          value:  'yes',
          question_id: '',
          q_type: item.q_type,
          title: this.ques.title,
          ques_title: item.title
        };
        this.addTonew(myItems);
      }

    });
  }
}
