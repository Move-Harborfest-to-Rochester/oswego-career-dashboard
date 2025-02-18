export interface BasacFacultyJSON {
  id: string;
  name: string;
  title: string;
  email: string;
}

export class BasacFaculty {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _title: string;
  private readonly _email: string;

  constructor(json: BasacFacultyJSON) {
    this._id = json.id;
    this._name = json.name;
    this._title = json.title;
    this._email = json.email;
  }

  public get id(): string { return this._id; }
  public get name(): string { return this._name; }
  public get title(): string { return this._title; }
  public get email(): string { return this._email; }
}
