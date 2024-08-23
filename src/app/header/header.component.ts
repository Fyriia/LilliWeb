import {Component, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DatePipe]
})
export class HeaderComponent implements OnInit{
currentTime!: string;

constructor(private datePipe : DatePipe) {
}

ngOnInit() {
  const now = new Date(); // Get the current date and time
  this.currentTime = this.datePipe.transform(now, 'shortTime') || '';
}
}
