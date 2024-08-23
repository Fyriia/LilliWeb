import {Injectable} from "@angular/core";
import {Project} from "./project.model";

@Injectable({providedIn: "root"})
export class ProjectService {
  projects! : Project[];

  findPwithIndex(i : number) : Project {
    return this.projects[i];
  }

  getProjects() : Project[] {
    return this.projects.slice();
  }
}
