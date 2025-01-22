import { Injectable } from '@angular/core';

interface BasacFacultyJSON {
  id: string;
  name: string;
  title: string;
  email: string;
}

class BasacFaculty {
  private readonly id: string;
  private readonly name: string;
  private readonly title: string;
  private readonly email: string;

  constructor(json: BasacFacultyJSON) {
    this.id = json.id;
    this.name = json.name;
    this.title = json.title;
    this.email = json.email;
  }
}

@Injectable({
  providedIn: 'root'
})
export class BasacFacultyService {

  constructor() { }

  getAll(): BasacFaculty[] {
    return [
      new BasacFaculty({ id: '1', name: 'Name 1', title: 'Title 1', email: 'Email 1' }),
      new BasacFaculty({ id: '2', name: 'Name 2', title: 'Title 2', email: 'Email 2' }),
      new BasacFaculty({ id: '3', name: 'Name 3', title: 'Title 3', email: 'Email 3' }),
      new BasacFaculty({ id: '4', name: 'Name 4', title: 'Title 4', email: 'Email 4' }),
    ];
  }
}
