import { environment } from "src/environments/environment";

export enum Endpoints {
    // Security
    SIGN_IN = 'auth/signin',
    REFRESH = 'auth/refresh',
    SIGN_OUT = 'auth/signout',
    SIGN_UP = 'auth/signup',

    // student
    MILESTONES = 'milestones',
    MILESTONES_COMPLETE = 'milestones/complete',
    EVENTS = 'events',
    HOMEPAGE_EVENTS = 'homepage-events',
    HOMEPAGE_TASKS = 'homepage-tasks',
    TASKS = 'tasks',
    USERS = 'users',
    UPDATE_ROLES = 'users/roles',
    CURRENT_USER = 'current-user',
    SUBMISSION = 'tasks/submission',
    ALL_SUBMISSIONS = 'student/submission',
    EDIT_PERSONAL_INFO = "personal-info",
    EDIT_EDUCATION = 'student/education',

    // Artifacts
    ARTIFACT = 'artifact/',
    ARTIFACT_FILE = 'artifact/file',
    UPLOAD_IMAGE_EVENT = "artifact/event",
    IMAGE_EVENT = 'artifact/image',
    USERS_PROFILE_PICTURE ="artifact/profile-picture",

    PORTFOLIO = 'portfolio',
    EDIT_SKILLS = 'student/skills',
    EDIT_INTERESTS = 'student/interests',
    // faculty
    USERS_SEARCH = 'users/search',
    FACULTY_SUBMISSIONS = 'faculty/milestones',

    // admin
    EDIT_MILESTONE = 'admin/edit-milestone',
    CREATE_MILESTONE = 'admin/create-milestone',
    EDIT_TASK = 'admin/edit-task',
    CREATE_TASK = 'admin/create-task',
    EDIT_EVENT = 'admin/edit-event',
    CREATE_EVENT = 'admin/create-event',

    // Projects
    PROJECTS = 'projects',

    // Jobs
    JOBS = 'jobs',
}

export function constructBackendRequest(segments: string, ...qParams: Array<{key: string, value: string | number}>): string {
    let uri = `${environment.requestURI}/api/${segments}`;

    // Append params
    if (qParams.length > 0) uri += '?';
    qParams.forEach((param, i) => {
        uri += `${param.key}=${param.value}`;
        if (i != qParams.length - 1) uri += '&';
    });

    // Enocde
    uri = encodeURI(uri);

    return uri;
}
