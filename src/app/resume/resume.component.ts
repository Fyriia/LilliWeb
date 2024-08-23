import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit, AfterViewInit{
  gerCv :any  = "CV_De.pdf";
  enCV:any  = "CV_En.pdf";
  enPic : string = "CV_En_page-0001.jpg";
  dePic :string= "CV_De_page-0001.jpg";
  currentPic : string = this.enPic;
  @ViewChild("enbtn") enBtn! : ElementRef;
  @ViewChild("gerbtn") gerBtn! : ElementRef;

  currentCv!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer,private renderer : Renderer2) { }

  ngOnInit(): void {
    this.gerCv = this.sanitizer.bypassSecurityTrustResourceUrl(this.gerCv);
    this.enCV = this.sanitizer.bypassSecurityTrustResourceUrl(this.enCV);
    this.currentCv = this.enCV;
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.enBtn.nativeElement, "active");
  }

  onEn(){
    this.currentCv = this.enCV;
    this.currentPic = this.enPic;
    this.renderer.addClass(this.enBtn.nativeElement, "active");
    this.renderer.removeClass(this.gerBtn.nativeElement, "active");
  }

  onDe(){
    this.currentCv = this.gerCv;
    this.currentPic = this.dePic;
    this.renderer.addClass(this.gerBtn.nativeElement, "active");
    this.renderer.removeClass(this.enBtn.nativeElement, "active");
  }

}
