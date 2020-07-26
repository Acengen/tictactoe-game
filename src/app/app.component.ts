import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loading = false;
  ngOnInit() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2500);
  }
}
