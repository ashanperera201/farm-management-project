import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from '../../../redux';
import { addSalesPrice, updateSalesPrice } from '../../../redux/actions/sales-price.actions';
import { SalesPriceModel } from '../../../shared/models/sales-price-model';
import { SalesPriceService } from '../../../shared/services/sales-price.service';
import { keyPressDecimals, keyPressNumbers } from '../../../shared/utils';

@Component({
  selector: 'app-sales-price-add',
  templateUrl: './sales-price-add.component.html',
  styleUrls: ['./sales-price-add.component.scss']
})
export class SalesPriceAddComponent implements OnInit, OnDestroy {

  @Input() isEditMode: boolean = false;
  @Input() existingSalesPrice: any;
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  saveButtonText: string = 'Submit';
  headerText: string = 'Add Sales Price';
  existingSalesPriceModel = new SalesPriceModel();
  addSalesPriceForm!: FormGroup;
  salesPriceSubscriptions: Subscription[] = [];

  constructor(
    private salesPriceService: SalesPriceService,
    private toastrService: ToastrService,
    private activeModal: NgbActiveModal,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initSalesPriceForm();
    this.configValues();
  }

  initSalesPriceForm = () => {
    this.addSalesPriceForm = new FormGroup({
      averageBodyWeight: new FormControl(null, Validators.compose([Validators.required])),
      salesPrice: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  configValues = () => {
    if (this.isEditMode) {
      this.saveButtonText = "Update";
      this.headerText = "Update Sales Price";

      if (this.existingSalesPrice) {
        const form = this.existingSalesPrice;
        this.addSalesPriceForm.patchValue(form);
      }
    }
  }

  saveOrUpdateSalesPrice = () => {
    if (this.addSalesPriceForm.valid) {
      const formRawValues: any = this.addSalesPriceForm.getRawValue();


      if (this.isEditMode) {
        const existsSalesPrice = Object.assign({}, this.existingSalesPrice);
        existsSalesPrice.averageBodyWeight = formRawValues.averageBodyWeight;
        existsSalesPrice.salesPrice = formRawValues.salesPrice;

        this.salesPriceSubscriptions.push(this.salesPriceService.updateSalesPrice(existsSalesPrice).subscribe(serviceRes => {
          if (serviceRes) {
            this.afterSave.emit(existsSalesPrice);
            this.store.dispatch(updateSalesPrice(existsSalesPrice));
            this.toastrService.success('Successfully updated.', 'Success');
            this.closeModal();
          }
        }, () => {
          this.toastrService.error('Failed to update.', 'Error');
        }))

      } else {
        this.blockUI.start('Saving in progress...');
        const formRawValues: any = this.addSalesPriceForm.getRawValue();

        this.salesPriceSubscriptions.push(this.salesPriceService.saveSalesPrice(formRawValues).subscribe((salesPrice: any) => {
          if (salesPrice && salesPrice.validity) {
            const savedResult = salesPrice.result.salesPrice;
            this.afterSave.emit(savedResult);
            this.store.dispatch(addSalesPrice(savedResult));
            this.toastrService.success("Successfully saved.", "Success");
            this.closeModal();
          }
          this.blockUI.stop();
        }, () => {
          this.toastrService.error("Failed to save.", "Error");
          this.blockUI.stop();
        }));
      }
    }
  }

  onKeyPressChanges = (event: any): boolean => {
    return keyPressNumbers(event);
  }

  onKeyPressChangesDecimal = (event: any): boolean => {
    return keyPressDecimals(event);
  }

  closeModal = () => {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    if (this.salesPriceSubscriptions && this.salesPriceSubscriptions.length > 0) {
      this.salesPriceSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }

}
