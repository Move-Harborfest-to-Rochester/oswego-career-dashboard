import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {YearLevel} from 'src/domain/Milestone';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Task, TaskType} from 'src/domain/Task';
import {constructBackendRequest, Endpoints} from 'src/app/util/http-helper';
import {HttpClient} from '@angular/common/http';
import {EventService} from 'src/app/homepage/events/event.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap
} from "rxjs";
import {EventList} from "../../homepage/events/event-list";
import {Event} from "../../../domain/Event";

@Component({
  selector: 'app-task-edit-modal',
  templateUrl: './task-edit-modal.component.html',
  styleUrls: ['./task-edit-modal.component.less']
})
@Injectable()
export class TaskEditModalComponent implements OnInit {

  public taskName: string = '';
  tYearLevel: YearLevel = YearLevel.Freshman; //default
  public currentTask: Task | undefined;
  taskForm!: FormGroup;
  dataLoaded: boolean = false;
  public events$: Observable<Event[]> = new Observable<Event[]>();
  protected readonly artifactType = TaskType.ARTIFACT;
  protected readonly eventType = TaskType.EVENT;
  protected readonly commentType = TaskType.COMMENT;

  constructor(
    public dialogRef: MatDialogRef<TaskEditModalComponent>,
    private formBuilder: FormBuilder,
    public http: HttpClient,
    private _snackBar: MatSnackBar,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) private modalData: any,
  ) {

    if (this.modalData.task) {
      this.taskName = this.modalData.name;
      this.currentTask = this.modalData.task;
      this.tYearLevel = this.modalData.task.yearLevel;
    } else {
      this.tYearLevel = this.modalData.name;
      this.taskName = '';
    }
  }

  get eventControl(): FormControl {
    return this.taskForm.get('event') as FormControl;
  }

  ngOnInit() {
    this.createForm();
    this.events$ = this.eventControl.valueChanges.pipe(
      startWith(null),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(eventNameFilter => {
        return this._filter(eventNameFilter ?? '');
      }),
    );
  }

  /**
   * Creates the FormGroup using the provided task data or left blank
   */
  createForm() {
    if (this.currentTask) {
      this.taskForm = this.formBuilder.group({
        name: [this.taskName],   //this field is hidden if the task already exists
        description: [this.currentTask.description],
        taskType: [this.currentTask.taskType],
        artifactName: [this.currentTask.artifactName],
        event: [this.currentTask.eventID],
        instructions: [this.currentTask.submissionInstructions]
      });
    } else {
      this.taskForm = this.formBuilder.group({
        name: [null, Validators.required],
        description: [null],
        taskType: [TaskType.ARTIFACT],
        artifactName: [null],
        event: [null],
        instructions: [null]  // default instructions?
      });
    }
  }

  /**
   * Used to determine whether to display the artifact name textbox or event selection
   */
  getTaskType(): string {
    return this.taskForm.get('taskType')?.value || TaskType.ARTIFACT;
  }

  /**
   * Takes task data from the form and sends the POST request
   * Either update task or create task, depending on whether there is a currentTask
   */
  saveTask() {
    if (this.currentTask) {
      const updateData: any = {};

      updateData.id = this.currentTask.taskID as unknown as number;
      if (this.taskForm.get('description')) {
        updateData.description = this.taskForm.get('description')!.value;
      }
      if (this.taskForm.get('instructions')) {
        updateData.instructions = this.taskForm.get('instructions')!.value;
      }

      // required information
      if (!this.taskForm.get('instructions')?.value ||
        this.taskForm.get('instructions')?.value.length == 0) {
        this.openSnackBar("Please add submission instructions");
        return;
      }

      // verify that task type specific fields are filled in
      if (this.taskForm.get('taskType')!.value == TaskType.ARTIFACT && (
        !this.taskForm.get('artifactName')?.value ||
        this.taskForm.get('artifactName')?.value.length == 0)) {
        this.openSnackBar("Please add an artifact name");
        return;
      } else if (this.taskForm.get('taskType')!.value == TaskType.EVENT && (
        !this.taskForm.get('event')?.value ||
        this.taskForm.get('event')?.value.length == 0)) {
        this.openSnackBar("Please select an event");
        return;
      }

      // only include the task type specific fields
      if (this.taskForm.get('taskType')!.value == TaskType.ARTIFACT) {
        updateData.taskType = this.taskForm.get('taskType')!.value;
        updateData.artifactName = this.taskForm.get('artifactName')!.value;
      } else if (this.taskForm.get('taskType')!.value == TaskType.EVENT) {
        updateData.taskType = this.taskForm.get('taskType')!.value;
        updateData.event = "" + this.taskForm.get('event')!.value;  //endpoint expects string
      } else if (this.taskForm.get('taskType')!.value == TaskType.COMMENT) {
        updateData.taskType = this.taskForm.get('taskType')!.value;
      }

      const url = constructBackendRequest(Endpoints.EDIT_TASK)
      this.http.post(url, updateData).subscribe(data => {
        if (!data) {
          this.openSnackBar("Something went wrong editing task");
          return;
        }
        this.openSnackBar("Task saved");
        this.closeModal();
      })
    } else {
      const newData: any = {};

      // required information
      if (!this.taskForm.get('name')?.value) {
        this.openSnackBar("Please add a task name");
        return;
      }
      if (!this.taskForm.get('instructions')?.value ||
        this.taskForm.get('instructions')?.value.length == 0) {
        this.openSnackBar("Please add submission instructions");
        return;
      }

      newData.name = this.taskForm.get('name')!.value;
      newData.yearLevel = this.tYearLevel;
      newData.isRequired = true; // for now
      if (this.taskForm.get('description')) {
        newData.description = this.taskForm.get('description')!.value;
      }
      if (this.taskForm.get('instructions')) {
        newData.instructions = this.taskForm.get('instructions')!.value;
      }

      // verify that task type specific fields are filled in
      if (this.taskForm.get('taskType')!.value == TaskType.ARTIFACT && (
        !this.taskForm.get('artifactName')?.value ||
        this.taskForm.get('artifactName')?.value.length == 0)) {
        this.openSnackBar("Please add an artifact name");
        return;
      } else if (this.taskForm.get('taskType')!.value == TaskType.EVENT && (
        !this.taskForm.get('event')?.value ||
        this.taskForm.get('event')?.value.length == 0)) {
        this.openSnackBar("Please select an event");
        return;
      }

      // only include the task type specific fields
      if (this.taskForm.get('taskType')!.value == TaskType.ARTIFACT) {
        newData.taskType = this.taskForm.get('taskType')!.value;
        newData.artifactName = this.taskForm.get('artifactName')!.value;
      } else if (this.taskForm.get('taskType')!.value == TaskType.EVENT) {
        newData.taskType = this.taskForm.get('taskType')!.value;
        newData.event = "" + this.taskForm.get('event')!.value;
      } else if (this.taskForm.get('taskType')!.value == TaskType.COMMENT) {
        newData.taskType = this.taskForm.get('taskType')!.value;
      }

      const url = constructBackendRequest(Endpoints.CREATE_TASK);
      this.http.post(url, newData).subscribe(data => {
        if (!data) {
          this.openSnackBar("Something went wrong creating task!");
          return;
        }
        this.openSnackBar("Task created");
        this.closeModal();
      })
    }
  }

  openSnackBar(
    message: string,
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    durationInSeconds: number = 3,
  ) {
    this._snackBar.open(message, 'close', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: durationInSeconds * 1000,
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  getEventNameById(events: Event[]) {
    return (eventId: number): string => {
      const event = events.find(e => e.eventID == eventId);
      return event?.name ?? '';
    }
  }

  private _filter(eventNameFilter?: string | number): Observable<Event[]> {
    console.log('event filter:', eventNameFilter);
    if (typeof eventNameFilter === 'number') {
      return this.eventService.getEventById(eventNameFilter).pipe(
        map((event: Event) => [event])
      );
    }
    if (!eventNameFilter?.trim()) {
      return this.eventService.getEvents().pipe(
        map((eventList: EventList) => eventList.events)
      );
    }
    return this.eventService.getEvents(eventNameFilter).pipe(
      map((eventList: EventList) => eventList.events)
    );
  }
}

