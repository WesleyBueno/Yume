import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dbm',
  templateUrl: './dbm.component.html',
  styleUrls: ['./dbm.component.css']
})
export class DbmComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  
  }

  toggleForm() {
    var container = document.querySelector('#containerForm');
    container?.classList.toggle('active')
}

  

}
