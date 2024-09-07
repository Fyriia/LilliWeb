import {Router, RouterModule, Routes, Scroll} from '@angular/router';
import {NgModule} from "@angular/core";
import {ProjectsComponent} from "./projects/projects.component";
import {HomeComponent} from "./home/home.component";
import {ResumeComponent} from "./resume/resume.component";
import {ContactComponent} from "./contact/contact.component";
import {GraphAppComponent} from "./projects/graph-app/graph-app.component";
import {ZymulatorComponent} from "./projects/zymulator/zymulator.component";
import {ToTComponent} from "./projects/to-t/to-t.component";
import {ViewportScroller} from "@angular/common";
import {filter} from "rxjs";

export const routes: Routes = [{path: '', component: HomeComponent, pathMatch: "full"},
  {path: 'projects', component: ProjectsComponent, children:[]},
  {path: 'resume', component: ResumeComponent},
  {path: 'graph', component: GraphAppComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'zym', component: ZymulatorComponent},
  {path: 'home', component: HomeComponent},
  {path: 'tot', component: ToTComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // This restores the scroll position when navigating back
    anchorScrolling: 'enabled',           // This scrolls to the anchor (fragment) when provided
    scrollOffset: [0, 64]                 // Optional: Adjust scroll position (e.g., for fixed headers)
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(filter((e): e is Scroll => e instanceof Scroll))
      .subscribe(e => {
        if (e.position) {
          viewportScroller.scrollToPosition(e.position); // Scroll back to previous position
        } else if (e.anchor) {
          viewportScroller.scrollToAnchor(e.anchor); // Scroll to the anchor
        } else {
          viewportScroller.scrollToPosition([0, 0]); // Scroll to top
        }
      });
  }
}


