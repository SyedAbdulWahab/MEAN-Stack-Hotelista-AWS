import { Component, ElementRef, ViewChild, Input } from '@angular/core';
@Component({
  selector: 'app-scripthack',
  templateUrl: './scripthack.component.html',
  styleUrls: ['./scripthack.component.css']
})
export class ScripthackComponent {

  @Input()
  src: string;

  @Input()
  type: string;

  @ViewChild('script') script: ElementRef;

  convertToScript() {
      var element = this.script.nativeElement;
      var script = document.createElement("script");
      script.type = this.type ? this.type : "text/javascript";
      if (this.src) {
          script.src = this.src;
      }
      if (element.innerHTML) {
          script.innerHTML = element.innerHTML;
      }
      var parent = element.parentElement;
      parent.parentElement.replaceChild(script, parent);
  }

  ngAfterViewInit() {
      this.convertToScript();
  }

}
