import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppState } from 'src/app/redux';
import { removeWeeklyApplication, setWeeklyApplication, updateWeeklyApplication } from '../../../redux/actions/weekly-applications.actions';
import { ExportTypes } from 'src/app/shared/enums/export-type';
import { ClubMemberService } from 'src/app/shared/services/club-member.service';
import { FarmService } from 'src/app/shared/services/farm.service';
import { FileService } from 'src/app/shared/services/file.service';
import { PondService } from 'src/app/shared/services/pond.service';
import { WeeklyApplicationsService } from 'src/app/shared/services/weekly-applications.service';
import { WeeklyApplicationAddComponent } from '../weekly-application-add/weekly-application-add.component';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';

@Component({
  selector: 'app-weekly-application-list',
  templateUrl: './weekly-application-list.component.html',
  styleUrls: ['./weekly-application-list.component.scss']
})
export class WeeklyApplicationListComponent implements OnInit, AfterViewInit {

  @BlockUI() blockUI!: NgBlockUI;

  weeklyApplicationSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;
  weeklyApplicationList: any[] = [];
  initialWeeklyApplicationList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  filterForm!: FormGroup;
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }

  constructor(private weeklyApplicationsService: WeeklyApplicationsService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private pondService: PondService,
    private customAlertService: CustomAlertService) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.fetchWeeklyApplication();
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
    this.weeklyApplicationList = this.initialWeeklyApplicationList;
    this.farmList =   [];
    this.pondList =   [];
    this.ownerList = this.initialData.ownerList;
  }

  filterChange = (event: any) => {
    this.weeklyApplicationList = this.weeklyApplicationList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if(owner){
      this.weeklyApplicationList = this.weeklyApplicationList.filter(x => x.owner?._id === owner);
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
    if(farmer){
      this.weeklyApplicationList = this.weeklyApplicationList.filter(x => x.farmer?._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }
    }
    if(pond){
      this.weeklyApplicationList = this.initialWeeklyApplicationList.filter(x => x.pond?._id === pond);
    }
  }

  ngAfterViewInit() {

  }

  fetchWeeklyApplication = () => {
    this.blockUI.start('Fetching Data......');
    this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.getAllWeeklyApplication().subscribe(res => {
      if (res && res.result) {
        this.weeklyApplicationList = res.result;
        this.initialWeeklyApplicationList = res.result;
        this.store.dispatch(setWeeklyApplication(res.result));
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data", "Error");
      this.blockUI.stop();
    }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklyApplicationSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
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

  addNewWeeklyApplication = () => {
    const addWeeklyApplicationModal = this.modalService.open(WeeklyApplicationAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addWeeklyApplicationModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
        this.weeklyApplicationList = Object.assign([], this.weeklyApplicationList)
        this.weeklyApplicationList.unshift(res);
      }
    });
  }

  updateWeeklyApplication = (weeklyApplication: any) => {
    const updateWeeklyApplicationModal = this.modalService.open(WeeklyApplicationAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateWeeklyApplicationModal.componentInstance.existingWeeklyApplication = JSON.parse(JSON.stringify(weeklyApplication));
    updateWeeklyApplicationModal.componentInstance.isEditMode = true;

    if (updateWeeklyApplicationModal.componentInstance.afterSave) {
      updateWeeklyApplicationModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
           const index = this.weeklyApplicationList.findIndex((up: any) => up._id === res._id);
          let weeklyApplicationRefs = JSON.parse(JSON.stringify(this.weeklyApplicationList));

          weeklyApplicationRefs[index].owner = res.owner;
          weeklyApplicationRefs[index].farmer = res.farmer;
          weeklyApplicationRefs[index].pond = res.pond;
          weeklyApplicationRefs[index].weekNumber = res.weekNumber;
          weeklyApplicationRefs[index].unit = res.unit;
          weeklyApplicationRefs[index].numberOfUnit = res.numberOfUnit;

          this.weeklyApplicationList = [...weeklyApplicationRefs];
          // ** 
          this.store.dispatch(updateWeeklyApplication(this.weeklyApplicationList[index]));
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
      const pfIds: string[] = (this.weeklyApplicationList.filter(x => x.isChecked === true)).map(x => x._id);
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

  proceedDelete = (weeklyApplicationIds: string[]) => {
    let form = new FormData();
    form.append("weeklyApplicationIds", JSON.stringify(weeklyApplicationIds));

    this.weeklyApplicationSubscriptions.push(this.weeklyApplicationsService.deleteWeeklyApplication(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        weeklyApplicationIds.forEach(e => { const index: number = this.weeklyApplicationList.findIndex((up: any) => up._id === e); this.weeklyApplicationList.splice(index, 1); });
        this.store.dispatch(removeWeeklyApplication(weeklyApplicationIds));
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
      this.weeklyApplicationList = this.weeklyApplicationList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.weeklyApplicationList = this.weeklyApplicationList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.weeklyApplicationList[index]['isChecked'] = !this.weeklyApplicationList[index]['isChecked'];
  }

  exportWeeklyApplicationsList = (type: any) => {
    const dataSet: any[] = this.weeklyApplicationList.map(x => {
      return {
        'Farm': `${x.farmer.farmName}`,
        'Week Number': `${x.weekNumber}`,
        'Type of Application': `${x.application?.applicationType}`,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
        'Unit': `${x.unit}`,
        'Number of Units': `${x.numberOfUnit}`,
      }
    });

    if (type === ExportTypes.CSV) {
      this.fileService.exportAsExcelFile(dataSet, "Ponds_Data");
    }
    else {
      const headers: any[] = ['Farm', 'Week Number', 'Type of Application', 'Created On', 'Unit', 'Number of Units'];
      this.fileService.exportToPDF("Weekly Applications Data", headers, dataSet, 'Weekly_Applications_Data');
    }
  }

  importWeeklySampling = () => {

  }

}
