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
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';

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
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private percentageFeedingService : PercentageFeedingService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private customAlertService: CustomAlertService
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
    this.farmList = [];
    this.pondList = [];
    this.ownerList = this.initialData.ownerList;
  }

  filterChange = (event: any) => {
    this.percentageFeedingList = this.initialPercentageFeedingList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if(owner){
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.owner._id === owner);
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
    if(farmer){
      this.percentageFeedingList = this.percentageFeedingList.filter(x => x.farmer._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
    }
    if(pond){
      this.percentageFeedingList = this.initialPercentageFeedingList.filter(x => x.pond?._id === pond);
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
        this.initialData.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.initialData.pondList = resPonds.result;
        this.pondList = [];
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.initialData.farmList = farmRes.result;
        this.farmList = [];
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
        this.percentageFeedingList = Object.assign([], this.percentageFeedingList)
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
    const deleteModal =  this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      const pfIds: string[] = (this.percentageFeedingList.filter(x => x.isChecked === true)).map(x => x._id);
      if (pfIds && pfIds.length > 0) {
        this.proceedDelete(pfIds);
      } else {
        this.toastrService.error("Please select items to delete.", "Error");
        this.blockUI.stop();
      }
      deleteModal.close();
    });
  }
  
  deleteRecord = (pfId: any) => {
    const deleteModal =  this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      this.proceedDelete([].concat(pfId));
      deleteModal.close();
    });
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
          'Owner': x.owner?.firstName,
          'Farm': x.farmer?.farmName,
          'Pond': x.pond?.pondNo,
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
          'Owner': x.owner?.firstName,
          'Farm': x.farmer?.farmName,
          'Pond': x.pond?.pondNo,
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
