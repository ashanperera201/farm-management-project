import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { DailyFeedAddComponent } from '../daily-feed-add/daily-feed-add.component';
import { PondService } from './../../../shared/services/pond.service';
import { FarmService } from './../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { DailyFeedService } from '../../../shared/services/daily-feed.service';
import { Store } from '@ngrx/store';
import { AppState, removeDailyFeed, setDailyFeed, updateDailyFeed } from '../../../redux';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';

@Component({
  selector: 'app-daily-feed-list',
  templateUrl: './daily-feed-list.component.html',
  styleUrls: ['./daily-feed-list.component.scss']
})
export class DailyFeedListComponent implements OnInit {

  isAllChecked! : boolean;
  initialDailyFeedList: any[] = [];
  dailyFeedList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  dailyFeedSubscriptions: Subscription[] = [];
  filterForm!: FormGroup;
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private dailyFeedService : DailyFeedService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.fetchDailyFeed();
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
    this.dailyFeedList = this.initialDailyFeedList;
    this.farmList =   [];
    this.pondList =   [];
    this.ownerList = this.initialData.ownerList;
  }


  filterChange = (event: any) => {
    this.dailyFeedList = this.initialDailyFeedList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if(owner){
      this.dailyFeedList = this.dailyFeedList.filter(x => x.owner._id === owner);
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
    if(farmer){
      this.dailyFeedList = this.dailyFeedList.filter(x => x.farmer._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
    }
    if(pond){
      this.dailyFeedList = this.initialDailyFeedList.filter(x => x.pond?._id === pond);
    }
  }

  fetchDailyFeed = () => {
    this.blockUI.start('Fetching Daily Feed......');
    this.dailyFeedSubscriptions.push(this.dailyFeedService.fetchDailyFeeds().subscribe(res=> {
      if(res && res.result){
        this.dailyFeedList = res.result;
        this.initialDailyFeedList = res.result;
        this.store.dispatch(setDailyFeed(res.result));
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data","Error");
      this.blockUI.stop();
    }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.dailyFeedSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.initialData.ownerList = ownerRes.result;
        this.ownerList = ownerRes.result;
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
    }));
    this.blockUI.stop();
  }

  addNewDailyFeed = () => {
    this.blockUI.start("Fetching Data.....");
    const addDailyFeedrModal = this.modalService.open(DailyFeedAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addDailyFeedrModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
        this.dailyFeedList = Object.assign([],this.dailyFeedList)
        this.dailyFeedList.unshift(res);
      }
    });
  }

  updateDailyFeed = (dailyFeed: any) => {
    this.blockUI.start("Fetching Data.....");
    const updateDailyFeedModal = this.modalService.open(DailyFeedAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateDailyFeedModal.componentInstance.existingDailyFeed = dailyFeed;
    updateDailyFeedModal.componentInstance.isEditMode = true;

    if (updateDailyFeedModal.componentInstance.afterSave) {
      updateDailyFeedModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          const index = this.dailyFeedList.findIndex((up: any) => up._id === res._id);
          let feedRef = JSON.parse(JSON.stringify(this.dailyFeedList));
          feedRef[index].owner = res.owner;
          feedRef[index].farmer = res.farmer;
          feedRef[index].pondNo = res.pondNo;
          feedRef[index].dailyFeedDate = res.dailyFeedDate;
          feedRef[index].calculatedDailyFeed = res.calculatedDailyFeed;
          feedRef[index].actualNumberOfKilos = res.actualNumberOfKilos;
          feedRef[index].remark = res.remark;

          this.dailyFeedList = [...feedRef];
          this.store.dispatch(updateDailyFeed(this.dailyFeedList[index]));
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
      const pfIds: string[] = (this.dailyFeedList.filter(x => x.isChecked === true)).map(x => x._id);
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
    form.append("dailyFeedIds", JSON.stringify(pfIds));
  
    this.dailyFeedSubscriptions.push(this.dailyFeedService.deleteDailyFeed(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        pfIds.forEach(e => { const index: number = this.dailyFeedList.findIndex((up: any) => up._id === e); this.dailyFeedList.splice(index, 1); });
        this.store.dispatch(removeDailyFeed(pfIds));
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
      this.dailyFeedList = this.dailyFeedList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.dailyFeedList = this.dailyFeedList.map(up => { return { ...up, isChecked: false }; });
    }
  }
  
  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.dailyFeedList[index]['isChecked'] = !this.dailyFeedList[index]['isChecked'];
  }

  exportDailyFeedList = (type: any) => {
    //TO DO
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const csvData: any[] = this.dailyFeedList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmer,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Ponds_Data");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const pdfData: any[] = this.dailyFeedList.map(x => {
        return {
          'Owner': x.owner,
          'Farm': x.farmer,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Created On', 'Pond Count','Area Of Pond', 'Grade of Pond','Fixed Cost' ];
      this.fileService.exportToPDF("Ponds Data", headers, pdfData, 'Pond_Data');
      this.blockUI.stop();
    }
  }

  importDailyFeed = () => {

  }

}
