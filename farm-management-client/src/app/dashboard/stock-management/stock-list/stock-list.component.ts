import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, addStockDetail, setStockDetails, updateStockDetail, removeStockBulk } from '../../../redux';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { StockService } from '../../../shared/services/stock.service';
import { StockAddComponent } from '../stock-add/stock-add.component';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked!: boolean;
  stockList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  stockSubscriptions: Subscription[] = [];

  constructor(
    private stockService: StockService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit(): void {
    this.fetchStockList();
  }

  fetchStockList = () => {
    this.blockUI.start("Fetching.....");
    //  TODO **: CHECK WHETHER STORE HAS DATA SET OR NOT LATER : VERSIONS.
    this.stockSubscriptions.push(this.stockService.fetchStock().subscribe(res => {
      if (res && res.result) {
        this.stockList = res.result;
        this.store.dispatch(setStockDetails(this.stockList));
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Unable to load Stock data", "Error");
      this.blockUI.stop();
    }));
  }

  addNewStock = () => {
    const addStockModal = this.modalService.open(StockAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });

    if (addStockModal.componentInstance.afterSave) {
      this.stockSubscriptions.push(addStockModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          this.fetchStockList();
        }
      }));
    }
  }

  updateStock = (stock: any) => {
    const addStockModal = this.modalService.open(StockAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-lg',
    });

    addStockModal.componentInstance.existingStock = JSON.parse(JSON.stringify(stock));
    addStockModal.componentInstance.isEditMode = true;

    if (addStockModal.componentInstance.afterSave) {
      this.stockSubscriptions.push(addStockModal.componentInstance.afterSave.subscribe((afterSaveRes: any) => {
        if (afterSaveRes) {
          const index = this.stockList.findIndex((up: any) => up._id === afterSaveRes._id);
          let stockRefs = JSON.parse(JSON.stringify(this.stockList));

          stockRefs[index].farmer = afterSaveRes.farmer;
          stockRefs[index].owner = afterSaveRes.owner;
          stockRefs[index].pond = afterSaveRes.pond;
          stockRefs[index].plCount = afterSaveRes.plCount;
          stockRefs[index].plAge = afterSaveRes.plAge;
          stockRefs[index].dateOfStocking = afterSaveRes.dateOfStocking;
          stockRefs[index].fullStocked = afterSaveRes.fullStocked;
          stockRefs[index].plPrice = afterSaveRes.plPrice;
          stockRefs[index].actualPlRemains = afterSaveRes.actualPlRemains;

          this.stockList = [...stockRefs];
          // ** 
          this.store.dispatch(updateStockDetail(this.stockList[index]));
        }
      }));
    }
  }

  deleteSelected = () => {
    const deleteModal =  this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      const stockIds: string[] = (this.stockList.filter(x => x.isChecked === true)).map(x => x._id);
      if (stockIds && stockIds.length > 0) {
        this.proceedDelete(stockIds);
      } else {
        this.toastrService.error("Please select stocks to delete.", "Error");
        this.blockUI.stop();
      }
      deleteModal.close();
    });
  }

  deleteFarmRecord = (stockId: any) => {
    const deleteModal =  this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      this.proceedDelete([].concat(stockId));
      deleteModal.close();
    });
  }

  proceedDelete = (stockIds: string[]) => {
    let form = new FormData();
    form.append("stockDetailIds", JSON.stringify(stockIds));

    this.stockSubscriptions.push(this.stockService.deleteStock(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        stockIds.forEach(e => { const index: number = this.stockList.findIndex((up: any) => up._id === e); this.stockList.splice(index, 1); });
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
      this.stockList = this.stockList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.stockList = this.stockList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.stockList[index]['isChecked'] = !this.stockList[index]['isChecked'];
  }

  exportStockList = (type: any) => {
    if (type === ExportTypes.CSV) {
      const csvData: any[] = this.stockList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmer.farmName}`,
          'Pond': `${x.pond.pondNo}`,
          'Number of PL`s': x.plCount,
          'PL Age': x.plAge,
          'Date of Stocking': moment(x.dateOfStocking).format('YYYY-MM-DD'),
          'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
          'Full Stocked': x.fullStocked,
          'PL Price (Rs)': x.plPrice,
          'Actual PL`s Remain': x.actualPlRemains
        }
      });
      this.fileService.exportAsExcelFile(csvData, "Ponds_Data");
    }
    else {
      const pdfData: any[] = this.stockList.map(x => {
        return {
          'Owner': `${x.owner.firstName} ${x.owner.lastName}`,
          'Farm': `${x.farmer.farmName}`,
          'Pond': `${x.pond.pondNo}`,
          'pl count': x.plCount ? `${x.plCount}` : '-',
          'actual pls': x.actualPlRemains ? `${x.actualPlRemains}` : '-',
          'Date of Stocking': moment(x.dateOfStocking).format('YYYY-MM-DD'),
          'Created On': moment(x.createdOn).format('YYYY-MM-DD')
        }
      });
      const headers: any[] = ['Owner', 'Farm', 'Pond', 'pl count', 'actual pls', 'Date of Stocking', 'Created On'];
      this.fileService.exportToPDF("Stock Data", headers, pdfData, 'Stock_Data');
    }
  }

  importStock = () => {

  }

}
