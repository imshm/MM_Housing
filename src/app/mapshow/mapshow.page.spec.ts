import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MapshowPage } from './mapshow.page';

describe('MapshowPage', () => {
  let component: MapshowPage;
  let fixture: ComponentFixture<MapshowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapshowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapshowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
