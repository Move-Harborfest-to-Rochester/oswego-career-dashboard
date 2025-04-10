import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task, TaskJSON} from 'src/domain/Task';
import {map, Observable, ReplaySubject} from "rxjs";
import {constructBackendRequest, Endpoints} from 'src/app/util/http-helper';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskCache$ = new ReplaySubject<any>();
  private hasBeenRequested = false;

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Gets all the tasks and caches the response
   *
   * If the cache has data in it, it returns the value of the cache, otherwise
   * it makes a request to the backend.
   * @param forceRefresh forces the cache to update by sending the request again
   */
  getTasks(forceRefresh?: boolean): Observable<Task[]> {
    if (!this.hasBeenRequested || forceRefresh) {
      this.hasBeenRequested = true;

      this.http.get<Task[]>(constructBackendRequest(Endpoints.TASKS)).subscribe((data) => {
        const mappedData = data.map((taskData: any) => {
            //if the milestone is sent as a object and not just the ID, extract the ID
            if (taskData.milestone) {
              taskData.milestoneID = taskData.milestone.id;
            }
            if (taskData.event) {
              taskData.eventID = taskData.event.id;
            }

            return new Task(taskData)
          })
        this.taskCache$.next(mappedData)
      })
    }

    return this.taskCache$.asObservable();

  }

  /**
   * Sends request to backend to retrieve list of tasks the user has not completed.
   * @param limit Limit to the number of tasks returned. overdue limit is equal to half the limit
   */
  getHomepageTasks(limit: number): Observable<Task[]> {
    return this.http.get<TaskJSON[]>(constructBackendRequest(Endpoints.HOMEPAGE_TASKS, {key:"limit", value:limit}))
      .pipe(map((data) => data.map((taskData: TaskJSON) => new Task(taskData))))
  }

  /**
   * API call to get data for a specific task
   */
  findById(id: number): Observable<Task> {
    return this.http.get<TaskJSON>(constructBackendRequest(`${Endpoints.TASKS}/${id}`))
      .pipe(map((taskJSON) => new Task(taskJSON)));
  }

}
