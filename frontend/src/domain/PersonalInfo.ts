export interface PersonalInfoJSON {
  firstName?: string;
  preferredName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  linkedIn?: string;
  description?: string;
}

export default class PersonalInfo {
  readonly firstName?: string;
  readonly preferredName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly phoneNumber?: string;
  readonly linkedIn?: string;
  readonly description?: string;

  constructor(json: PersonalInfoJSON) {
    this.firstName = json.firstName;
    this.preferredName = json.preferredName;
    this.lastName = json.lastName;
    this.email = json.email;
    this.phoneNumber = json.phoneNumber;
    this.linkedIn = json.linkedIn;
    this.description = json.description;
  }
}
