import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ExportTypes } from '../../../shared/enums/export-type';
import { FeedBrandService } from '../../../shared/services/feed-brand.service';
import { FeedBrandAddComponent } from '../feed-brand-add/feed-brand-add.component';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-feed-brand-list',
  templateUrl: './feed-brand-list.component.html',
  styleUrls: ['./feed-brand-list.component.scss']
})
export class FeedBrandListComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  isAllChecked! : boolean;
  feedBrandList: any[] = [];
  feedBrandIdList: any[] = [];
  filterParam!: string;
  exportTypes = ExportTypes;
  pageSize: number = 10;
  page: any = 1;
  feedBrandListSubscriptions: Subscription[] = [];

  constructor(
    private feedbandService: FeedBrandService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fileService: FileService) { }

  ngOnInit(): void {
    this.fetchFeedBrandsList();
  }

  fetchFeedBrandsList = () => {
    this.blockUI.start('Fetching Feed Brands...');
    this.feedBrandListSubscriptions.push(this.feedbandService.fetchFeedBands().subscribe(res => {
      if (res && res.result) {
        this.feedBrandList = res.result;
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      this.toastrService.error("Failed to load Feed Brands", "Error");
    }));
  }

  addNewFeedBrand = () => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    if (addFeedBrandModal.componentInstance.afterSave) {
      addFeedBrandModal.componentInstance.afterSave.subscribe((res: any) => {
        if (res && res.feedBrand) {
          this.feedBrandList.unshift(res.feedBrand);
        }
      });
    }
  }

  updateFeedBrand = (feedBrand: any) => {
    const addFeedBrandModal = this.modalService.open(FeedBrandAddComponent, {
      animation: true,
      keyboard: true,
      backdrop: true,
      modalDialogClass: 'modal-md',
    });
    addFeedBrandModal.componentInstance.existingFeedBrand = feedBrand;
    addFeedBrandModal.componentInstance.isEditMode = true;
  }

  deleteSelected = () => {
    this.blockUI.start('Deleting....');
    const feedBrandIds: string[] = (this.feedBrandList.filter(x => x.isChecked === true)).map(x => x._id);
    if (feedBrandIds && feedBrandIds.length > 0) {
      this.proceedDelete(feedBrandIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  deleteRecord = (feedId: any) => {
    this.blockUI.start('Deleting....');
    this.proceedDelete([].concat(feedId));
  }

  proceedDelete = (feedBrandIds: string[]) => {
    let form = new FormData();
    form.append("feedBrandIds", JSON.stringify(feedBrandIds));

    this.feedBrandListSubscriptions.push(this.feedbandService.deleteFeedBands(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.isAllChecked = false;
        feedBrandIds.forEach(e => { const index: number = this.feedBrandList.findIndex((up: any) => up._id === e); this.feedBrandList.splice(index, 1); });
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
      this.feedBrandList = this.feedBrandList.map(p => { return { ...p, isChecked: true }; });
    } else {
      this.feedBrandList = this.feedBrandList.map(up => { return { ...up, isChecked: false }; });
    }
  }

  singleSelectionChange = (index: number) => {
    this.isAllChecked = false;
    this.feedBrandList[index]['isChecked'] = !this.feedBrandList[index]['isChecked'];
  }

  exportFeedBrandList = (type: any) => {
    if (type === ExportTypes.CSV) {
      this.blockUI.start('Exporting Excel...');
      const csvData: any[] = this.feedBrandList.map(x => {
        return {
          'Brand Name': x.brandName,
          'Grades': x.grades,
          'Price': x.price,
          'Shrimp Weight': x.shrimpWeight,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      this.fileService.exportAsExcelFile(csvData, "feed_brands");
      this.blockUI.stop();
    }
    else {
      this.blockUI.start('Exporting Pdf...');
      const pdfData: any[] = this.feedBrandList.map(x => {
        return {
          'Brand Name': x.brandName,
          'Grades': x.grades,
          'Price': x.price,
          'Shrimp Weight': x.shrimpWeight,
          'Created On':  moment(x.createdOn).format('YYYY-MM-DD'),
        }
      });
      const headers: any[] = ['Brand Name', 'Grades', 'Price', 'Shrimp Weight', 'Created On'];
      this.fileService.exportToPDF("Feed Brand Data", headers, pdfData, 'feed_brands');
      this.blockUI.stop();
    }
  }

  importFeedBands = () => {

  }

  ngOnDestroy() {
    if (this.feedBrandListSubscriptions && this.feedBrandListSubscriptions.length > 0) {
      this.feedBrandListSubscriptions.forEach(res => {
        res.unsubscribe();
      });
    }
  }
}
