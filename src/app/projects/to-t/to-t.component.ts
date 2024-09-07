import { Component } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-to-t',
  standalone: true,
  imports: [],
  templateUrl: './to-t.component.html',
  styleUrl: './to-t.component.scss'
})
export class ToTComponent {

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

}
