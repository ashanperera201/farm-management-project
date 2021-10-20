import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss']
})
export class CustomAlertComponent implements OnInit {

  @Input() title: string = '';
  @Input() message: string = '';
  @Input() saveButton: string = '';
  @Input() cancelButton: string = '';

  @Output() saveClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  onSaveClick(event: any) {
    if (this.saveClick != null) {
      this.saveClick.emit({ event: event });
    }
  }

  onCancelClick(event: any) {
    if (this.cancelClick != null) {
      this.cancelClick.emit({ event: event });
    }
  }


}
