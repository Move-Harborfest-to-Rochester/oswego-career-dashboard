import { LangUtils } from "src/app/util/lang-utils";
import PersonalInfo from "src/domain/PersonalInfo";
import Education from "src/domain/Education";
import { StudentDetails, StudentDetailsJSON } from "src/domain/StudentDetails";

/**
 * JSON for a user object retrieved from the backend
 */
export interface UserJSON {
    readonly id: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly dateCreated: number;
    readonly lastLogin: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly signedUp: boolean,
    readonly preferredName: string;
    readonly canEmail: boolean;
    readonly canText: boolean;
    readonly studentDetails?: StudentDetailsJSON;
    readonly role: Role;
    readonly linkedin: string;
    readonly profilePictureId: number;
}

/**
 * A user
 */
export class User {
    readonly id: string;
    email: string;
    phoneNumber: string;
    readonly dateCreated: Date;
    readonly lastLogin: Date;
    firstName: string;
    lastName: string;
    preferredName: string;
    readonly signedUp: boolean;
    canEmail: boolean;
    canText: boolean;
    studentDetails?: StudentDetails
    role: Role;
    linkedin: string;
    profilePictureId: number;
    profilePictureURL: string | null = null;

    constructor(json: UserJSON) {
        this.id = json.id;
        this.email = json.email;
        this.phoneNumber = json.phoneNumber;
        this.dateCreated = new Date(json.dateCreated);
        this.lastLogin = new Date(json.lastLogin);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.preferredName = json.preferredName;
        this.signedUp = json.signedUp;
        this.canEmail = json.canEmail;
        this.canText = json.canText;
        if (LangUtils.exists(json.studentDetails)) {
            this.studentDetails = new StudentDetails(json.studentDetails!)
        }
        this.role = json.role;
        this.linkedin = json.linkedin;
        this.profilePictureId = json.profilePictureId;
    }

    static makeEmpty() {
        return new User({
            id: '',
            email: '',
            firstName: 'No',
            lastName: 'User',
            preferredName: 'No',
            signedUp: true,
            phoneNumber: '0000000000',
            dateCreated: 0,
            lastLogin: 0,
            canEmail: false,
            canText: false,
            role: Role.Student,
            linkedin: '',
            profilePictureId: 0,
        });
    }

    get name() {
        return LangUtils.exists(this.preferredName) ? `${this.preferredName} ${this.lastName}` : `${this.firstName} ${this.lastName}`;
    }

    hasFacultyPrivileges(): boolean {
      return this.role == Role.Faculty || this.hasAdminPrivileges();
    }

    hasAdminPrivileges(): boolean {
      return this.role == Role.Admin || this.hasSuperAdminPrivileges();
    }

    hasSuperAdminPrivileges(): boolean {
      return this.role == Role.SuperAdmin;
    }

    setEducation(education: Education) {
      if (!this.studentDetails) {
        this.studentDetails = StudentDetails.makeEmpty();
      }
      this.studentDetails.universityId = `${education.universityId}`;
      this.studentDetails.yearLevel = education.year;
      this.studentDetails.gpa = education.gpa;
      this.studentDetails.degreePrograms = [
        ...education.majors,
        ...education.minors
      ];
    }



    get formattedRole(): string {
      if (this.role === Role.SuperAdmin) {
        return 'Super Admin';
      }
      return this.role;
    }

    get fullName(): string {
      const name = this.preferredName ? this.preferredName : this.firstName;
      return `${name} ${this.lastName}`;
    }

    getPersonalInfo(): PersonalInfo {
      return new PersonalInfo({
        firstName: this.firstName,
        preferredName: this.preferredName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        linkedIn: this.linkedin,
        description: this.studentDetails?.description
      });
    }

    setPersonalInfo(personalInfo: PersonalInfo): void {
      this.firstName = personalInfo.firstName ?? '';
      this.preferredName = personalInfo.preferredName ?? '';
      this.lastName = personalInfo.lastName ?? '';
      this.email = personalInfo.email ?? '';
      this.phoneNumber = personalInfo.phoneNumber ?? '';
      this.linkedin = personalInfo.linkedIn ?? '';
      if (this.studentDetails) {
        this.studentDetails.description = personalInfo.description ?? '';
      }
    }

}

export enum Role {
  Student = 'Student',
  Faculty = 'Faculty',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin'
}
