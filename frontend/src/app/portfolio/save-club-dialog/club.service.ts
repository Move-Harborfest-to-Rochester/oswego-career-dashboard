import {HttpClient} from "@angular/common/http";
import {Club, ClubJSON} from "../../../domain/Club";
import {map, Observable, pipe} from "rxjs";
import {constructBackendRequest, Endpoints} from "../../util/http-helper";
import {Injectable} from "@angular/core";

export type ClubRequest = {
  id?: string, //only has id if editing a club
  name: string,
  startDate: Date,
  endDate: Date | null
}


@Injectable({
  providedIn: "root"
})
export class ClubService {
  constructor(
    private readonly http: HttpClient
  ){}
  saveClub(request: ClubRequest) : Observable<Club> {
      return this.http.put<ClubJSON>(constructBackendRequest(Endpoints.CLUBS), request).pipe(
        map((clubJSON) => {
          return new Club(clubJSON);
        })
      )
  }

  deleteClub(clubId: string): Observable<void> {
    return this.http.delete<void>(constructBackendRequest(`${Endpoints.CLUBS}/${clubId}`));
  }

}
