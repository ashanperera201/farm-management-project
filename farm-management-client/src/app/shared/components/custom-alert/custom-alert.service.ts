import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAlertComponent } from './custom-alert.component';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {

  constructor(private modalService: NgbModal) { }

  openDeleteconfirmation = () => {
    let customAlertModalRef = this.modalService.open(CustomAlertComponent, {
      animation: true,
      keyboard: true,
      backdrop: true
    });
    customAlertModalRef.componentInstance.title = 'Confirmation';
    customAlertModalRef.componentInstance.message = 'Are you sure to delete record ';
    customAlertModalRef.componentInstance.saveButton = 'Yes';
    customAlertModalRef.componentInstance.cancelButton = 'No';

    return customAlertModalRef;
  }
}
