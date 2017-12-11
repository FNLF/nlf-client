import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-app-child',
  templateUrl: './app-child.component.html',
  styleUrls: ['./app-child.component.css'],

})
export class AppChildComponent {


  message: string = '';

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }

  newMessage() {
    this.data.changeMessage(this.message)
  }
}