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
