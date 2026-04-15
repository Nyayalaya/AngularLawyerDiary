import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.html',
  styleUrls: ['./splash.css']
})
export class Splash implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/default']); // redirect to welcome page
    }, 3000); // 3 seconds splash screen
  }
}
