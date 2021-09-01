import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { PercentageFeedingAddComponent } from '../percentage-feeding-add/percentage-feeding-add.component';
import { PercentageFeedingService } from '../../../shared/services/percentage-feeding.service';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';

@Component({
  selector: 'app-percentage-feeding-list',
  templateUrl: './percentage-feeding-list.component.html',
  styleUrls: ['./percentage-feeding-list.component.scss']
})
export class PercentageFeedingListComponent implements OnInit {

  isAllChecked! : boolean;
  percentageFeedingList: any[] = [];
  initialPercentageFeedingList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  percentageFeedSubscriptions: Subscription[] = [];
  filterForm! : FormGroup;

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private percentageFeedingService : PercentageFeedingService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.fetchPercentageFeeding();
    this.fetchInitialData();
  }

  initFilterForm= () => {
    this.filterForm = new FormGroup({
      owner: new FormControl(null),
      farmer: new FormControl(null),
      pond: new FormControl(null),
    });
  }

  resetFilters = () => {
    this.filterForm.reset();
    this.percentageFeedingList = this.initialPercentageFeedingList;
  }

  filterChange = (event: any) => {
    this.percentageFeedingList = this.initialPercentageFeedingList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if(owner){
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.owner._id === owner);
    }
    if(farmer){
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.farmer._id === farmer);
    }
    if(pond){
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.pond._id === pond);
    }
  }

  fetchPercentageFeeding = () => {
    this.blockUI.start('Fetching Data......');
    this.percentageFeedSubscriptions.push(this.percentageFeedingService.fetchPercentageFeedings().subscribe(res=> {
      if(res && res.result){
        this.percentageFeedingList = res.result;
        this.initialPercentageFeedingList = res.result;
        // this.farmList = res.result.farmer;
        // this.pondList = res.result.pond;
        // this.ownerList = res.result.owner;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data","Error");
      this.blockUI.stop();
    }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.percentageFeedSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.pondList = resPonds.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.farmList = farmRes.result;
      }
    }))
    this.blockUI.stop();
  }

  addNewPercentageFeeding = () => {
    const addPercentageFeedingrModal = this.modalService.open(PercentageFeedingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addPercentageFeedingrModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
        this.percentageFeedingList.unshift(res);
      }
    });
  }

  updatePercentageFeeding = (percentageFeeding: any) => {
    this.blockUI.start("Fetching Data.....");
    const updatePercentageFeedingrModal = this.modalService.open(PercentageFeedingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updatePercentageFeedingrModal.componentInstance.existingPercentageFeed = percentageFeeding;
    updatePercentageFeedingrModal.componentInstance.isEditMode = true;
    if (updatePercentageFeedingrModal.componentInstance.afterSave) {
      updatePercentageFeedingrModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          const index = this.percentageFeedingList.findIndex((up: any) => up._id === res._id);
          this.percentageFeedingList[index].owner = res.owner;
          this.percentageFeedingList[index].farmer = res.farmer;
          this.percentageFeedingList[index].pond = res.pond;
          this.percentageFeedingList[index].averageBodyWeight = res.averageBodyWeight;
          this.percentageFeedingList[index].feedPercentage = res.feedPercentage;
        }
      });
    }
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const pfIds: string[] = (this.percentageFeedingList.filter(x => x.isChecked === true)).map(x => x._id);
    if (pfIds && pfIds.length > 0) {
      this.proceedDelete(pfIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }
  
  deleteRecord = (pfId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(pfId));
  }
  
  proceedDelete = (pfIds: string[]) => {
    let form = new FormData();
    form.append("feedingPercentageIds", JSON.stringify(pfIds));
  
    this.percentageFeedSubscriptions.push(this.percentageFeedingService.deletePercentageFeeding(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        pfIds.forEach(e => { const index: number = this.percentageFeedingList.findIndex((up: any) => up._id === e); this.percentageFeedingList.splice(index, 1); });
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
      this.percentageFeedingList = this.percentageFeedingList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.percentageFeedingList = this.percentageFeedingList.map(up => { return { ...up, isChecked: false }; });
    }
  }
  
  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.percentageFeedingList[index]['isChecked'] = !this.percentageFeedingList[index]['isChecked'];
  }

  exportPercentageFeedingList = (type: any) => {
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const csvData: any[] = this.percentageFeedingList.map(x => {
        return {
          'Owner': x.owner.firstName,
          'Farm': x.farmer.farmName,
          'Pond': x.pond.pondNo,
          'Average Body Weight': x.averageBodyWeight,
          'Feed Percentage' : x.feedPercentage,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD')
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Feeding_Percentage_Data");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const pdfData: any[] = this.percentageFeedingList.map(x => {
        return {
          'Owner': x.owner.firstName,
          'Farm': x.farmer.farmName,
          'Pond': x.pond.pondNo,
          'Average Body Weight': x.averageBodyWeight,
          'Feed Percentage' : x.feedPercentage,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD')
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Pond', 'Average Body Weight', 'Feed Percentage', 'Created On'];
      this.fileService.exportToPDF("Feeding Percentage Data", headers, pdfData, 'Feeding_Percentage_Data');
      this.blockUI.stop();
    }
  }

}
