import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventMainPageComponent } from './event-main-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import {MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { Event } from "../../../domain/Event";
import { EventService } from 'src/app/homepage/events/event.service';
import { of } from 'rxjs';
import { EventEditModalComponent } from '../event-edit-modal/event-edit-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventEditModalModule } from '../event-edit-modal/event-edit-modal.module';
import {EventImageModalComponent} from "../event-image-modal/event-image-modal.component";
import SpyObj = jasmine.SpyObj;
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from '@angular/material/card'

describe('EventMainPageComponent', () => {
  const createSpyObj= jasmine.createSpyObj;
  let component: EventMainPageComponent;
  let fixture: ComponentFixture<EventMainPageComponent>;
  let httpMock: HttpTestingController;
  let eventServiceSpy = createSpyObj('EventService', ['getEvents']);
  let dialogRefSpy: SpyObj<MatDialogRef<EventImageModalComponent>>;
  dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed'])
  dialogRefSpy.afterClosed.and.returnValue(of(0))

  eventServiceSpy.getEvents.and.returnValue(of(Array(new Event({
    name: "name",
    description: "description",
    date: new Date().toDateString(),
    id: 1,
    recurring: true,
    organizer: "organizer",
    location: "location",
    eventLink: "sample link",
    buttonLabel: "test",
    imageId: 1,
  }))));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventMainPageComponent, EventEditModalComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatTabsModule,
        MatListModule,
        MatSnackBarModule,
        MatFormFieldModule,
        EventEditModalModule,
        EventEditModalModule,
        MatCardModule,
      ],
      providers: [MatDialog],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(EventMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the EventEditModal in a MatDialog', () => {
    const testEvent = new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 1,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample link",
      buttonLabel: "test",
      imageId: 1,
    });

    spyOn(component.matDialog,'open').and.callThrough();
    component.openEventEditModal(testEvent);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      event: testEvent
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(EventEditModalComponent, dialogConfig);
  });

  it('should open the EventImageModal in a MatDialog', () => {
    const testEvent = new Event({
      name: "name",
      description: "description",
      date: new Date().toDateString(),
      id: 1,
      recurring: true,
      organizer: "organizer",
      location: "location",
      eventLink: "sample link",
      buttonLabel: "test",
      imageId: 1,
    });

    spyOn(component.matDialog,'open').and.returnValue(dialogRefSpy);
    component.openEventImageModal(testEvent);

    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "500px";
    dialogConfig.data = {
      event: testEvent,
      hasImage: true
    }

    expect(component.matDialog.open).toHaveBeenCalledWith(EventImageModalComponent, dialogConfig);
  });

});
