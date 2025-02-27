import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import { LangUtils } from '../util/lang-utils';
import {ImageCroppedEvent} from "ngx-image-cropper";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Event} from "../../domain/Event";
import {constructBackendRequest, Endpoints} from "../util/http-helper";
import {HttpClient} from "@angular/common/http";

/**
 * Component to upload artifacts to the server
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less']
})
export class ImageUploadComponent implements OnInit {
  status: "initial" | "uploading" | "success" | "error" | "cropping" = "initial"; // Variable to store file status
  rawFile: File | undefined; // Variable to store file
  croppedFile: Blob | undefined | null = null; // Variable to store file
  croppedImageUrl: SafeUrl = '';

  private maxSizeMegaBytes = 10;
  private maxSizeBytes = this.maxSizeMegaBytes * 1024 * 1024; // 10 MB

  @Output() artifactIdEmitter: EventEmitter<number> = new EventEmitter();
  @Output() closeEmitter: EventEmitter<number> = new EventEmitter();
  @Output() ImageIdEmitter: EventEmitter<null> = new EventEmitter();
  @Input() hasImage: boolean = false;
  @Input() current_event: Event | undefined;
  @Input() uploadStrategy: null | ((formData: FormData) => Observable<number>)  = null;
  @Input() aspectRatio: number = 1;
  @Input() roundCropper: boolean = false;

  protected acceptedFileTypes: string = ".png, .jpeg";

  constructor(
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public http: HttpClient
  ) { }

  ngOnInit() {

  }

  /**
   * Loads the file
   */
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.size > this.maxSizeBytes) {
        alert(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`)
        // Display an error message or perform other actions
        console.error(`File size exceeds the maximum allowed size (${this.maxSizeMegaBytes} MB).`);
      } else {
        // File is within the allowed size, proceed with handling
        this.status = "cropping";
        this.rawFile = file;
      }
    }
  }

  /**
   * Deletes the artifact
   */
  onCancel() {
    this.status = "initial";
    this.rawFile = undefined;
    this.croppedFile = null
  }

  /**
   * Uploads a file to the server and returns the artifact id of the newly created
   * artifact
   */
  onUpload() {
    if (this.croppedFile != null && this.rawFile != undefined) {
      const formData = new FormData();

      formData.append('file', this.croppedFile, this.rawFile.name);

      if (this.uploadStrategy != null) {
        let upload$: Observable<number>;
        upload$ = this.uploadStrategy(formData);

        this.status = 'uploading';

        upload$.pipe(
          // FIXME this does not seem to work so added check for null below
          catchError(error => {
            this.status = 'error';
            console.log(error);
            return of(0);
          })
        ).subscribe((artifactId) => {
          if (artifactId == null) {
            this.status = 'error';
            console.log('fail');
          } else {
            this.artifactIdEmitter.next(artifactId);
            this.status = 'success';
            this.closeModal(1000, "Image upload successful");
          }
        });
      } else {
        this.status = 'error';
        console.error("Upload strategy not set");
      }
    }
  }

  /**
   * Formats the string based on the size of the file
   */
  formatBytes(): string {
    if (!LangUtils.exists(this.rawFile)) return '0 bytes';
    if (this.rawFile!.size > 1000000) return `${(this.rawFile!.size / 1000000).toFixed(2)} mb`
    else if (this.rawFile!.size > 1000) return `${(this.rawFile!.size / 1000).toFixed(2)} kb`
    else return `${this.rawFile!.size} bytes`;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl != null) {
      // maybe change this to something safer in the future
      this.croppedImageUrl = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      this.croppedFile = event.blob;
    }
  }

  doneCropping() {
    this.status = 'initial'
  }

  closeModal(waitTime: number = 0, message: string) {
    this.closeEmitter.emit(waitTime);
    if (message){
      this._snackBar.open(message, 'close', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 3000,
      });
    }

  }

  removeImage() {
    this.ImageIdEmitter.emit(null);

    const updateData: any = {
      id: this.current_event?.eventID,
      name: this.current_event?.name,
      date: this.current_event?.date,
      location: this.current_event?.location,
      organizer: this.current_event?.organizer,
      isRecurring: this.current_event?.isRecurring,
      imageId: null
    };
    console.log("Updated Dat: " + updateData.name);

    const url = constructBackendRequest(Endpoints.EDIT_EVENT);
    this.http.post(url, updateData).subscribe({
      next: (data) => {
        if (data) {
          this.closeModal(0, "Image removed and set to default");
        } else {
          console.error("No data returned from backend.");
        }
      },
      error: (err) => {
        console.error("Error updating event:", err);
        this._snackBar.open("Failed to update event", 'close', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000,
        });
      }
    });
  }
}

export enum UploadType {
  EventImage,
  ProfileImage
}
