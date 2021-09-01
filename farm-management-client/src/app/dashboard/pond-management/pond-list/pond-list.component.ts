import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { FileService } from '../../../shared/services/file.service';
import { ExportTypes } from '../../../../app/shared/enums/export-type';
import { PondService } from '../../../../app/shared/services/pond.service';
import { PondAddComponent } from '../pond-add/pond-add.component';

@Component({
  selector: 'app-pond-list',
  templateUrl: './pond-list.component.html',
  styleUrls: ['./pond-list.component.scss']
})
export class PondListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked!: boolean;
  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  pondListSubscriptions: Subscription[] = [];
  
  constructor(
    private pondService: PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchPondsList();
  }

  fetchPondsList = () => {
    this.blockUI.start('Fetching Ponds...');
    this.pondListSubscriptions.push(this.pondService.fetchPonds().subscribe(res => {
      if (res && res.result) {
        this.pondList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Unable to load Pond data","Error");
    }));
  }

  addNewPond = () => {
    const addPondModal = this.modalService.open(PondAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    if (addPondModal.componentInstance.afterSave) {
      this.pondListSubscriptions.push(addPondModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          this.pondList.unshift(res);
        }
      }));
    }
  }

  updatePond = (pond: any) => {
    this.blockUI.start("Fetching data.....");
    const updatePondModal = this.modalService.open(PondAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updatePondModal.componentInstance.existingPond =  JSON.parse(JSON.stringify(pond));
    updatePondModal.componentInstance.isEditMode = true;
    
    if (updatePondModal.componentInstance.afterSave) {
      updatePondModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          
          const index = this.pondList.findIndex((up: any) => up._id === res._id);
          let pondRefs = JSON.parse(JSON.stringify(this.pondList));         
          pondRefs[index].owner = res.owner;
          pondRefs[index].farmer = res.farmer;
          pondRefs[index].areaOfPond = res.areaOfPond;
          pondRefs[index].pondNo = res.pondNo;
          pondRefs[index].gradeOfPond = res.gradeOfPond;
          pondRefs[index].fixedCost = res.fixedCost;

          this.pondList = [...pondRefs]
        }
      });
    }
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const pondIds: string[] = (this.pondList.filter(x => x.isChecked === true)).map(x => x._id);
    if (pondIds && pondIds.length > 0) {
      this.proceedDelete(pondIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteRecord = (pondId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(pondId));
  }

  proceedDelete = (pondIds: string[]) => {
    let form = new FormData();
    form.append("pondDetailIds", JSON.stringify(pondIds));

    this.pondListSubscriptions.push(this.pondService.deletePonds(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        pondIds.forEach(e => { const index: number = this.pondList.findIndex((up: any) => up._id === e); this.pondList.splice(index, 1); });
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.pondList = this.pondList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.pondList = this.pondList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.pondList[index]['isChecked'] = !this.pondList[index]['isChecked'];
  }

  exportPondList = (type: any) => {
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      
      const csvData: any[] = this.pondList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmer.farmName}`,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Pond Count': x.pondNo,
          'Area Of Pond': x.areaOfPond,
          'Grade of Pond': x.gradeOfPond,
          'Fixed Cost': x.fixedCost
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Ponds_Data");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const pdfData: any[] = this.pondList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmer.farmName}`,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
          'Pond Count': x.pondNo,
          'Area Of Pond': x.areaOfPond,
          'Grade of Pond': x.gradeOfPond,
          'Fixed Cost': x.fixedCost
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Created On', 'Pond Count','Area Of Pond', 'Grade of Pond','Fixed Cost' ];
      this.fileService.exportToPDF("Ponds Data", headers, pdfData, 'Pond_Data');
      this.blockUI.stop();
    }
  }

  importPonds = () => {

  }

  ngOnDestroy() {
    if (this.pondListSubscriptions && this.pondListSubscriptions.length > 0) {
      this.pondListSubscriptions.forEach(res => {
        res.unsubscribe();
      });
    }
  }

}
