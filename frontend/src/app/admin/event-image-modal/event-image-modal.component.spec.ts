import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {EventImageModalComponent} from './event-image-modal.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MockComponent} from "ng-mocks";
import {ImageUploadComponent} from "../../file-upload/image-upload.component";
import {Event, EventJSON} from "../../../domain/Event";
import SpyObj = jasmine.SpyObj;

describe('EventImageModalComponent', () => {
  let component: EventImageModalComponent;
  let fixture: ComponentFixture<EventImageModalComponent>;
  const eventJSON: EventJSON = {
    name: 'string',
    description: 'string',
    date: 'string',
    id: 1,
    recurring: true,
    organizer: 'string',
    location: 'string',
    eventLink: 'string',
    buttonLabel: 'string',
    photoUrl: 'https://example.com/image.jpg',
    locationUrl: 'https://example.com/location',
    endDate: 'string',
  }
  let event: Event = new Event(eventJSON);
  let dialogRefSpy: SpyObj<MatDialogRef<EventImageModalComponent>>;
  dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'])


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventImageModalComponent],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MockComponent(ImageUploadComponent),
      ],
      providers: [
        MatDialog,
        FormBuilder,
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {event}},
      ],
      teardown: {destroyAfterEach: false}
    });
    fixture = TestBed.createComponent(EventImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close modal', fakeAsync(() => {
    // @ts-ignore
    component.closeModal();
    tick();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  }));

  it('artifact id change', () => {
    component.onArtifactId(99);
    // @ts-ignore
    expect(component.artifactID).toEqual(99);
  });
});
