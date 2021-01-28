import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbmComponent } from './dbm.component';

describe('DbmComponent', () => {
  let component: DbmComponent;
  let fixture: ComponentFixture<DbmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
