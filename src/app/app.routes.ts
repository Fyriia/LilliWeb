import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {HeaderComponent} from "./header/header.component";
import {ProjectsComponent} from "./projects/projects.component";
import {HomeComponent} from "./home/home.component";
import {ResumeComponent} from "./resume/resume.component";
import {ContactComponent} from "./contact/contact.component";
import {GraphAppComponent} from "./projects/graph-app/graph-app.component";
import {ZymulatorComponent} from "./projects/zymulator/zymulator.component";
import {ToTComponent} from "./projects/to-t/to-t.component";

export const routes: Routes = [{path: '', component: HomeComponent, pathMatch: "full"},
  {path: 'projects', component: ProjectsComponent, children:[]},
  {path: 'resume', component: ResumeComponent},
  {path: 'graph', component: GraphAppComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'zym', component: ZymulatorComponent},
  {path: 'home', component: HomeComponent},
  {path: 'tot', component: ToTComponent}];


NgModule({imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
