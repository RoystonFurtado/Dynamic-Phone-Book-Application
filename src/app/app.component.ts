import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  }

export class Contact {
  constructor(
    public firstName:String,
    public lastName:String,
    public mobileNo:Number
    ){}
}