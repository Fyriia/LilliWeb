import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  /*move(): void {
    this.curX += (this.tgX - this.curX) / 2;
    this.curY += (this.tgY - this.curY) / 2;
    const interBubble = document.querySelector('.interactive') as HTMLDivElement;
    interBubble.style.transform = `translate(${Math.round(this.curX)}px, ${Math.round(this.curY)}px)`;
    requestAnimationFrame(() => {
      this.move();
    });
  }*/

  onMouseMove(event: MouseEvent): void {
    /*this.tgX = event.clientX;
    this.tgY = event.clientY;*/
  }


  ngOnInit(): void {
   /* this.move();*/
  }

  curX = 0;
  curY = 0;
  tgX = 0;
  tgY = 0;
}
