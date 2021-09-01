import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import 'jspdf-autotable'
import { encode } from 'base-64';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  logo: string = `../../../assets/media/logos/logo-taprobane.png`;

  constructor() { }

  exportAsExcelFile(json: any, excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, `${fileName}${EXCEL_EXTENSION}`);
  }

  exportToPDF(title: string, headers: any[], data: any, fileName: string, footerTitle?: string, showLogo: boolean = false) {
    let doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    if (showLogo) { doc.addImage(this.logo, pageWidth / 2.3, 4, 25, 25); }
    doc.text(title, pageWidth / 2, showLogo ? 40 : 8, { align: 'center' });
    doc.setFontSize(7);

    const strctData: any[] = this.structureData(headers, data);
    (doc as any).autoTable({
      bodyStyles: { valign: 'top' },
      styles: { font: 'helvetica', fontStyle: 'bold', lineColor: '#000' },
      head: [headers],
      body: strctData,
      startY: showLogo ? 45 : 14
    });
    doc.text(`${footerTitle ? footerTitle : ''}`, pageWidth / 2.3, doc.internal.pageSize.height - 10);
    doc.save(fileName);
  }

  private structureData = (headers: any[], data: any[]): any[] => {
    let retVal: any[] = [];
    if (data && headers && headers.length > 0 && data.length > 0) {
      retVal = data.map((x, i) => {
        const keys: any[] = Object.keys(x);
        let arrr: any[] = [];

        keys.forEach(x2 => {
          arrr.push(x[x2])
        });
        return arrr;
      })
    }

    return retVal;
  }
}
