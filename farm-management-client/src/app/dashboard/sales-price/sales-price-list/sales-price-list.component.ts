import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from '../../../redux/application-state';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FileService } from '../../../shared/services/file.service';
import { SalesPriceService } from '../../../shared/services/sales-price.service';
import { SalesPriceAddComponent } from '../sales-price-add/sales-price-add.component';
import { removeSalesPrice } from '../../../redux/actions/sales-price.actions';
import { CustomAlertComponent } from 'src/app/shared/components/custom-alert/custom-alert.component';
import { CustomAlertService } from 'src/app/shared/components/custom-alert/custom-alert.service';

@Component({
  selector: 'app-sales-price-list',
  templateUrl: './sales-price-list.component.html',
  styleUrls: ['./sales-price-list.component.scss']
})
export class SalesPriceListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  salesPriceSubscriptions: Subscription[] = [];
  isAllChecked!: boolean;
  salesPriceList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;

  constructor(
    private salesPriceService: SalesPriceService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService,
    private store: Store<AppState>,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit(): void {
    this.fetchSalesPrice();
  }

  fetchSalesPrice = () => {
    this.blockUI.start('Fetching Data......');
    this.salesPriceSubscriptions.push(this.salesPriceService.fetchSalesPrice().subscribe(res => {
      if (res && res.result) {
        this.salesPriceList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error("Failed to load Data", "Error");
      this.blockUI.stop();
    }));
  }

  addNewSalesPrice = () => {
    const addSalesPriceModal = this.modalService.open(SalesPriceAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addSalesPriceModal.componentInstance.afterSave.subscribe((res: any) => {
      this.fetchSalesPrice();
    });
  }

  updateSalesPrice = (salesPrice: any) => {
    const updateSalesPriceModal = this.modalService.open(SalesPriceAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    updateSalesPriceModal.componentInstance.existingSalesPrice = salesPrice;
    updateSalesPriceModal.componentInstance.isEditMode = true;
    if (updateSalesPriceModal.componentInstance.afterSave) {

      this.salesPriceSubscriptions.push(updateSalesPriceModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res) {
          const index = this.salesPriceList.findIndex((sp: any) => sp._id === res._id);
          this.salesPriceList[index].salesPrice = res.salesPrice;
          this.salesPriceList[index].averageBodyWeight = res.averageBodyWeight;
        }
      }));
    }
  }

  deleteSelected = () => {
    const deleteModal = this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      const pfIds: string[] = (this.salesPriceList.filter(x => x.isChecked === true)).map(x => x._id);
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
    const deleteModal = this.customAlertService.openDeleteconfirmation();

    (deleteModal.componentInstance as CustomAlertComponent).cancelClick.subscribe(() => {
      deleteModal.close();
    });

    (deleteModal.componentInstance as CustomAlertComponent).saveClick.subscribe(() => {
      this.blockUI.start('Deleting....');
      this.proceedDelete([].concat(pfId));
      deleteModal.close();
    });
  }

  proceedDelete = (salesPriceIds: string[]) => {
    let form = new FormData();
    form.append("salesPriceIds", JSON.stringify(salesPriceIds));

    this.salesPriceSubscriptions.push(this.salesPriceService.deleteSalesPrice(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        salesPriceIds.forEach(e => { const index: number = this.salesPriceList.findIndex((up: any) => up._id === e); this.salesPriceList.splice(index, 1); });
        this.store.dispatch(removeSalesPrice(salesPriceIds));
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
      this.salesPriceList = this.salesPriceList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.salesPriceList = this.salesPriceList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.salesPriceList[index]['isChecked'] = !this.salesPriceList[index]['isChecked'];
  }

  exportSalesPriceList = (type: any) => {
    const dataSet: any[] = this.salesPriceList.map(x => {
      return {
        'Average Body Weight': `${x.averageBodyWeight}`,
        'Created On': moment(x.createdOn).format('YYYY-MM-DD'),
        'Sales Price': `${x.salesPrice}`,
      }
    });

    if (type === ExportTypes.CSV) {
      this.fileService.exportAsExcelFile(dataSet, "Sales_Price_Data");
    }
    else {
      const headers: any[] = ['Average Body Weight', 'Created On', 'Sales Price'];
      this.fileService.exportToPDF("Sales Price Data", headers, dataSet, 'Sales_Price_Data');
    }
  }

  importWeeklySampling = () => {
  }
}
