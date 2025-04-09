import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import {Task, TaskType} from "../../domain/Task";
import {EventService} from "../homepage/events/event.service";
import {Observable} from "rxjs";
import {Event} from "../../domain/Event";

@Component({
  selector: 'tasks-modal',
  templateUrl: './tasks-modal.component.html',
  styleUrls: ['./tasks-modal.component.less']
})
export class TasksModalComponent implements OnInit {
  showUploadButton: boolean = true;
  pdfURL: any = '';
  TaskType = TaskType;

  constructor(
    public dialogRef: MatDialogRef<TasksModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected modalData: {
      task: Task,
      overdue: boolean
    },
    public dialog: MatDialog,
    private readonly eventService: EventService
  ) {
  }

  private _event: Event | null = null;

  get event(): Event | null {
    return this._event;
  }

  ngOnInit() {
    if (this.modalData.task.taskType == TaskType.EVENT && this.modalData.task.eventID) {
      this.getEvent(this.modalData.task.eventID).subscribe(event => {
        this._event = event;
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  private getEvent(eventId: number): Observable<Event> {
    return this.eventService.getEventById(eventId);
  }
}
