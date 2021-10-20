import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { WeeklySamplingService } from '../../../shared/services/weekly-sampling.service';
import { WeeklySamplingAddComponent } from '../weekly-sampling-add/weekly-sampling-add.component';
import { AppState, removeWeeklySamplings, setWeeklySamplings } from '../../../redux';
import { FarmService } from '../../../shared/services/farm.service';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { PondService } from '../../../shared/services/pond.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';

@Component({
  selector: 'app-weekly-sampling-list',
  templateUrl: './weekly-sampling-list.component.html',
  styleUrls: ['./weekly-sampling-list.component.scss']
})

export class WeeklySamplingListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  weeklySamplingSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;
  weelySamplingList: any[] = [];
  initialWeelySamplingList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }
  filterForm!: FormGroup;
  clubMemberList : any;
  farmList : any;
  pondList : any;

  constructor(
    private pondService: PondService,
    private clubMemberService: ClubMemberService,
    private farmService: FarmService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private weeklySamplingService: WeeklySamplingService,
    private store: Store<AppState>,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit(): void {
    this.initFilterForm();
    this.fetchWeeklySamplingData();
    this.fetchInitialData();
  }

  initFilterForm= () => {
    this.filterForm = new FormGroup({
      owner: new FormControl(null),
      farmer: new FormControl(null),
      pond: new FormControl(null),
    });
  }

  filterChange = (event: any) => {
    this.weelySamplingList = this.initialWeelySamplingList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if(owner){
      this.weelySamplingList = this.weelySamplingList.filter(x => x.owner?._id === owner);
      const filteredFarmList = this.initialData.farmList.filter((x: any) => x.owner && x.owner._id === owner);
      if (filteredFarmList && filteredFarmList.length > 0) {
        this.farmList = filteredFarmList;
      } else {
        this.farmList = [];
      }
    }
    if(farmer){
      this.weelySamplingList = this.weelySamplingList.filter(x => x.farmer?._id === farmer);
      const pondList = this.initialData.pondList.filter((x: any) => (x.farmer && x.farmer._id === farmer) && (x.owner && x.owner._id === owner));
      if (pondList && pondList.length > 0) {
        this.pondList = pondList;
      } else {
        this.pondList = [];
      }

    }
    if(pond){
      this.weelySamplingList = this.initialWeelySamplingList.filter(x => x.pond?._id === pond);
    }
  }

  fetchWeeklySamplingData = () => {
    this.blockUI.start('Fetching....');
    this.weeklySamplingSubscriptions.push(this.weeklySamplingService.getAllWeeklySamplings().subscribe((samplingResponse: any) => {
      if (samplingResponse && samplingResponse.validity) {
        this.weelySamplingList = samplingResponse.result;
        this.initialWeelySamplingList = samplingResponse.result;
        this.store.dispatch(setWeeklySamplings(samplingResponse.result));
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    }))
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.weeklySamplingSubscriptions.push(this.clubMemberService.fetchClubMembers().pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.initialData.ownerList = ownerRes.result;
        this.clubMemberList = ownerRes.result;
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

  addNewWeeklySampling = () => {
    const addWeeklySamplingModal = this.modalService.open(WeeklySamplingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });
    addWeeklySamplingModal.componentInstance.afterSave.subscribe((res: any) => {
      if (res) {
        this.weelySamplingList = Object.assign([], this.weelySamplingList)
        this.weelySamplingList.unshift(res);
      }
    });
  }

  updateWeelySampling = (weeklySample: any) => {
    const addWeeklySamplingModal = this.modalService.open(WeeklySamplingAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });

    addWeeklySamplingModal.componentInstance.existingWeeklySampling = JSON.parse(JSON.stringify(weeklySample));
    addWeeklySamplingModal.componentInstance.isEditMode = true;

    if (addWeeklySamplingModal.componentInstance.afterSave) {
      addWeeklySamplingModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          const index = this.weelySamplingList.findIndex((up: any) => up._id === res._id);
          let samplingRef = JSON.parse(JSON.stringify(this.weelySamplingList));

          samplingRef[index].samplingDate = res.samplingDate;
          samplingRef[index].farmer = res.farmer;
          samplingRef[index].owner = res.owner;
          samplingRef[index].pond = res.pond;
          samplingRef[index].dateOfCulture = res.dateOfCulture;
          samplingRef[index].totalWeight = res.totalWeight;
          samplingRef[index].totalShrimp = res.totalShrimp;
          samplingRef[index].averageBodyWeight = res.averageBodyWeight;
          samplingRef[index].previousAwb = res.previousAwb;
          samplingRef[index].gainInWeight = res.gainInWeight;
          samplingRef[index].expectedSurvivalPercentage = res.expectedSurvivalPercentage;

          this.weelySamplingList = [...samplingRef];
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
      const weeklySamplingIds: string[] = (this.weelySamplingList.filter(x => x.isChecked === true)).map(x => x._id);
      if (weeklySamplingIds && weeklySamplingIds.length > 0) {
        this.proceedDelete(weeklySamplingIds);
      } else {
        this.toastrService.error("Please select weekly samplings to delete.", "Error");
        this.blockUI.stop();
      }
      deleteModal.close();
    });
  }

  deleteWeeklySamplingRecord = (weeklySamplingIds: any) => {
    const deleteModal =  this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      this.proceedDelete([].concat(weeklySamplingIds));
      deleteModal.close();
    });
  }

  proceedDelete = (weeklySamplingIds: string[]) => {
    let form = new FormData();
    form.append("weeklySampleIds", JSON.stringify(weeklySamplingIds));

    this.weeklySamplingSubscriptions.push(this.weeklySamplingService.deleteWeeklySampling(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        weeklySamplingIds.forEach(e => { const index: number = this.weelySamplingList.findIndex((up: any) => up._id === e); this.weelySamplingList.splice(index, 1); });
        this.store.dispatch(removeWeeklySamplings(weeklySamplingIds));
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
      this.weelySamplingList = this.weelySamplingList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.weelySamplingList = this.weelySamplingList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.weelySamplingList[index]['isChecked'] = !this.weelySamplingList[index]['isChecked'];
  }


  exportWeeklySampling = (type: any) => {
    const dataSet: any[] = this.weelySamplingList.map(x => {
      return {
        'Sampling date': moment(x.samplingDate).format('YYYY-MM-DD'),
        'Farm': `${x.farmer.farmName}`,
        'Date of culture': x.dateOfCulture,
        'Total weight': x.totalWeight,
        'Total shrimp': x.totalShrimp,
        'Average body weight': x.averageBodyWeight,
        'Gain in weight': x.gainInWeight,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD')
      }
    });

    if (type === ExportTypes.CSV) {
      this.fileService.exportAsExcelFile(dataSet, "Ponds_Data");
    }
    else {
      const headers: any[] = ['sampling date', 'Farm', 'Date of culture', 'Total weight', 'Total shrimp', 'Average body weight', 'Gain in weight', 'Created On'];
      this.fileService.exportToPDF("Stock Data", headers, dataSet, 'Stock_Data');
    }
  }

  resetFilters = () => {
    this.filterForm.reset();
    this.weelySamplingList = this.initialWeelySamplingList;
    this.farmList =   [];
    this.pondList =   [];
    this.clubMemberList = this.initialData.ownerList;
  }

  importWeeklySampling = () => {

  }

}
