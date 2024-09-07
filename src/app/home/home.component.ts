import {AfterViewInit, Component, ElementRef} from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef) {}


  ngAfterViewInit(): void {
    const paths = this.elementRef.nativeElement.querySelectorAll('path');

    paths.forEach((path: HTMLElement, index: number) => {
      path.style.animationDelay = `${index * 0.5}s`;
    });
  }

}
