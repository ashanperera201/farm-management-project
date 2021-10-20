import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { ExportTypes } from '../../../shared/enums/export-type';
import { ClubMemberService } from '../../../shared/services/club-member.service';
import { FarmService } from '../../../shared/services/farm.service';
import { PondService } from '../../../shared/services/pond.service';
import { FileService } from '../../../shared/services/file.service';
import { FeedChartService } from '../../../shared/services/feed-chart.service';
import { AppState, selectStockDetails } from '../../../redux';
import { PercentageFeedingService } from 'src/app/shared/services/percentage-feeding.service';
import { WeeklySamplingService } from 'src/app/shared/services/weekly-sampling.service';
import { keyPressNumbers } from 'src/app/shared/utils';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';

@Component({
  selector: 'app-feed-chart-list',
  templateUrl: './feed-chart-list.component.html',
  styleUrls: ['./feed-chart-list.component.scss']
})
export class FeedChartListComponent implements OnInit {
  
  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked! : boolean;
  feedChartList: any[] = [];
  initialFeedChartList: any[] = [];
  ownerList: any[] = [];
  farmList: any[] = [];
  pondList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  feedChartSubscription: Subscription[] = [];
  filterForm!: FormGroup;
  dateOfCulture!: any;
  initialData: any = {
    farmList: [],
    ownerList: [],
    pondList: []
  }
  stockDetails: any[] = [];
  percentageFeedingList: any[] = [];
  weelySamplingList: any[] = [];
  currentDate = new Date();
  disableShowButton : boolean = true;

  constructor(
    private feedChartService : FeedChartService,
    private clubMemberService : ClubMemberService,
    private farmService : FarmService,
    private pondService : PondService,
    private toastrService: ToastrService,
    private fileService: FileService,
    private store: Store<AppState>,
    private percentageFeedingService: PercentageFeedingService,
    private weeklySamplingService: WeeklySamplingService,
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
      dateOfCulture: new FormControl(null),
      feedFrequency: new FormControl(null, Validators.compose([Validators.required]))
    });

    this.filterForm.controls['dateOfCulture'].disable();
  }

  filterChange = (event: any) => {
    this.feedChartList = this.initialFeedChartList;
    const owner = this.filterForm.get("owner")?.value;
    const farmer = this.filterForm.get("farmer")?.value;
    const pond = this.filterForm.get("pond")?.value;

    if(owner){
      this.farmList = this.initialData.farmList.filter((x: any) => x.owner?._id === owner);
    }
    if(farmer){
      this.pondList = this.initialData.pondList.filter((x: any) => x.farmer?._id === farmer);
    }

    if (pond) {
      const stock = this.stockDetails.find(sd => sd.farmer?._id === farmer && sd.pond?._id === pond);
      this.percentageFeedingList = this.percentageFeedingList.filter((x: any) => x.pond?._id === pond);
      this.weelySamplingList = this.weelySamplingList.filter((x: any) =>  x.pond?._id === pond);
      if (this.filterForm.get("feedFrequency")?.value) {
        this.calculateDateOfCulture(stock);
      }      
    }
  }

  calculateDateOfCulture = (stock: any) => {
    if (stock) {
      // this.blockUI.start('Fetching data........');
      //const currentDate = new Date();
      const stockDate = new Date(stock.dateOfStocking);
      const subtractedDate = this.currentDate.getDate() - stockDate.getDate();
      this.currentDate.setDate(subtractedDate);
      this.filterForm.get("dateOfCulture")?.setValue(moment(this.currentDate).format('M/D/YYYY'));
      //this.calculateData(this.currentDate);
    }
  }

  enableShowButton =(event: any) => {
    if(keyPressNumbers(event)){
      this.disableShowButton = false; 
      return true;
    }
    else{
      return false;
    }
  }

  resetFilters = () => {
    this.filterForm.reset();
    this.feedChartList = [];
    this.initialFeedChartList = [];
    this.disableShowButton = true;
  }

  calculateData(doc: any) {
    debugger 
    const currentDate: any = new Date();
    if (currentDate.getTime() > doc.getTime()) {
      const diffTime = Math.abs(currentDate - doc);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 28) {
        const iterateDays = (n: any) => (f: any) => {
          let iter = (i: any) => {
            if (i === n) return
            f (i)
            iter (i + 1)
          }
          return iter (0)
        }
        iterateDays(diffDays-1)((i: any) => {
          doc.setDate(doc.getDate() + 1);
          const gridDataObj = {
            date: '',
            totalFeedDay: 0,
            numKiloFeed: 0,
            numOfTimesFeed: 0
          };
          gridDataObj.date = doc.toString();
          const totalFeedDay = 2 + 0.2 * i;
          gridDataObj.totalFeedDay = totalFeedDay;
          gridDataObj.numKiloFeed = totalFeedDay / this.filterForm.get("feedFrequency")?.value;
          gridDataObj.numOfTimesFeed = 24 / totalFeedDay
          this.feedChartList.push(gridDataObj);
        });
        this.blockUI.stop();
      } else {
        const iterateDays = (n: any) => (f: any) => {
          let iter = (i: any) => {
            if (i === n) return
            f (i)
            iter (i + 1)
          }
          return iter (0)
        }

        iterateDays(diffDays -1)((i: any) => {
          const gridDataObj = {
            date: '',
            totalFeedDay: 0,
            numKiloFeed: 0,
            numOfTimesFeed: 0
          };

          doc.setDate(doc.getDate() + 1);
          gridDataObj.date = doc.toString();
          const filterData = this.filterPercentageBydate(doc);
          const filterWeeeklySampling = this.filterWeeeklySamplingBydate(doc);
          if (filterData.length > 0 && filterWeeeklySampling.length > 0) {
            const totalFeedDay = filterData[0].averageBodyWeight * filterWeeeklySampling[0].expectedSurvivalPercentage * filterData[0].feedPercentage;
            gridDataObj.totalFeedDay = totalFeedDay;
            gridDataObj.numKiloFeed = totalFeedDay / this.filterForm.get("feedFrequency")?.value;
            gridDataObj.numOfTimesFeed = 24 / totalFeedDay
            this.feedChartList.push(gridDataObj); 
          }
        })
        this.blockUI.stop();
      }
      
    } else {
      const diffTime = Math.abs(doc - currentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 28) {
        const iterateDays = (n: any) => (f: any) => {
          let iter = (i: any) => {
            if (i === n) return
            f (i)
            iter (i + 1)
          }
          return iter (0)
        }
        iterateDays(diffDays-1)((i: any) => {
          doc.setDate(doc.getDate() + 1);
          const gridDataObj = {
            date: '',
            totalFeedDay: 0,
            numKiloFeed: 0,
            numOfTimesFeed: 0
          };
          gridDataObj.date = doc.toString();
          const totalFeedDay = 2 + 0.2 * i;
          gridDataObj.totalFeedDay = totalFeedDay;
          gridDataObj.numKiloFeed = totalFeedDay / this.filterForm.get("feedFrequency")?.value;
          gridDataObj.numOfTimesFeed = 24 / totalFeedDay
          this.feedChartList.push(gridDataObj);
        });
      } else {
        const iterateDays = (n: any) => (f: any) => {
          let iter = (i: any) => {
            if (i === n) return
            f (i)
            iter (i + 1)
          }
          return iter (0)
        }

        iterateDays(diffDays -1)((i: any) => {
          const gridDataObj = {
            date: '',
            totalFeedDay: 0,
            numKiloFeed: 0,
            numOfTimesFeed: 0
          };

          doc.setDate(doc.getDate() + 1);
          gridDataObj.date = doc.toString();
          const filterData = this.filterPercentageBydate(doc);
          const filterWeeeklySampling = this.filterWeeeklySamplingBydate(doc);
          if (filterData.length > 0 && filterWeeeklySampling.length > 0) {
            const totalFeedDay = filterData[0].averageBodyWeight * filterWeeeklySampling[0].expectedSurvivalPercentage * filterData[0].feedPercentage;
            gridDataObj.totalFeedDay = totalFeedDay;
            gridDataObj.numKiloFeed = totalFeedDay / this.filterForm.get("feedFrequency")?.value;
            gridDataObj.numOfTimesFeed = 24 / totalFeedDay
            this.feedChartList.push(gridDataObj); 
          }
        })
      }
    }

    if(this.feedChartList && this.feedChartList.length > 0){
      this.toastrService.success("Data Generated Successfully","Success");
    }
    else{
      this.toastrService.warning("No data for selected inputs","No  Data");
      this.filterForm.reset();
    }

  }

  filterPercentageBydate(date: any) {
    const percentageFeedingData = this.percentageFeedingList.filter((x: any) => {
      x.createdOn = date
    })

    return percentageFeedingData;
  }

  filterWeeeklySamplingBydate(date: any) {
    const weeklySamplingData = this.weelySamplingList.filter((x: any) => {
      x.createdOn = date
    })

    return weeklySamplingData;
  }


  fetchDailyFeed = () => {
    //Adding Date of Culture (DOC) to existing array
    let today = new Date();
    this.store.select(selectStockDetails).subscribe(res => {
      if(res){
        res = res.map((obj: any) => { return { ...obj, doc : 0 };});
        res.forEach((x: any) => {
          let stockDate = new Date(x.dateOfStocking)
          let diff = (today.getTime() - stockDate.getTime()) / (1000 * 3600 * 24);
          x.doc = diff;
        });
      }
    })


    // this.blockUI.start('Fetching Daily Feed......');
    // this.feedChartSubscription.push(this.feedChartService.fetchFeedCharts().subscribe(res=> {
    //   if(res && res.result){
    //     this.feedChartList = res.result;
    //   }
    //   this.blockUI.stop();
    // }, () => {
    //   this.toastrService.error("Failed to load Data","Error");
    //   this.blockUI.stop();
    // }));
  }

  fetchInitialData = () => {
    this.blockUI.start('Fetching Data...');
    this.feedChartSubscription.push(this.store.select(selectStockDetails).pipe(switchMap(stockDetails => {
      if (stockDetails) {
        this.stockDetails = stockDetails;
      }
      return this.clubMemberService.fetchClubMembers()
    })).pipe(switchMap((ownerRes: any) => {
      if (ownerRes && ownerRes.result) {
        this.ownerList = ownerRes.result;
      }
      return this.pondService.fetchPonds()
    })).pipe(switchMap((resPonds: any) => {
      if (resPonds && resPonds.result) {
        this.initialData.pondList = resPonds.result;
      }
      return this.percentageFeedingService.fetchPercentageFeedings()
    })).pipe(switchMap((percentageFeed: any) => {
      if (percentageFeed && percentageFeed.result) {
        this.percentageFeedingList = percentageFeed.result;
      }
      return this.weeklySamplingService.getAllWeeklySamplings()
    })).pipe(switchMap((samplingResponse: any) => {
      if (samplingResponse && samplingResponse.result) {
        this.weelySamplingList = samplingResponse.result;
      }
      return this.farmService.fetchFarms()
    })).subscribe((farmRes: any) => {
      if (farmRes && farmRes.result) {
        this.initialData.farmList = farmRes.result;
      }
    }))
    this.blockUI.stop();
  }

  deleteSelected = () => {
    const deleteModal =  this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      const pfIds: string[] = (this.feedChartList.filter(x => x.isChecked === true)).map(x => x._id);
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

    this.toastrService.warning('Record deletion is under maintainance', 'Warning');

    // form.append("dailyFeedIds", JSON.stringify(pfIds));
  
    // this.feedChartSubscription.push(this.feedChartService.deleteFeedCharts(form).subscribe((deletedResult: any) => {
    //   if (deletedResult) {
    //     this.isAllChecked = false;
    //     pfIds.forEach(e => { const index: number = this.feedChartList.findIndex((up: any) => up._id === e); this.feedChartList.splice(index, 1); });
    //     this.toastrService.success('Successfully deleted.', 'Success');
    //   }
    //   this.blockUI.stop();
    // }, () => {
    //   this.toastrService.error('Failed to delete', 'Error');
    //   this.blockUI.stop();
    // }));
  }
  
  onSelectionChange = () => {
    if (this.isAllChecked) {
      this.feedChartList = this.feedChartList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.feedChartList = this.feedChartList.map(up => { return { ...up, isChecked: false }; });
    }
  }
  
  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.feedChartList[index]['isChecked'] = !this.feedChartList[index]['isChecked'];
  }

  exportFeedChartList = (type: any) => {
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const csvData: any[] = this.feedChartList.map(x => {
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
      const pdfData: any[] = this.feedChartList.map(x => {
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

}
