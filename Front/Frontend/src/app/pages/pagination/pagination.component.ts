
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges{
  @Input() totalPages: number = 2; // Assurez-vous que le type est défini ici
  @Input() currentPage: number = 1; // Assurez-vous que le type est défini ici
  pages: (number | 0)[] = []; // tableau qui peut contenir des nombres ou des zéros pour les points

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages'] || changes['currentPage']) {
      this.createPagination(this.totalPages, this.currentPage);
    }
  }

  createPagination(totalPages: number, page: number): void {
    let beforePage = page - 1;
    let afterPage = page + 1;
    this.pages = [];

    if (page > 1) {
      this.pages.push(-1); // prev button
    }

    if (page > 2) {
      this.pages.push(1); // first page
      if (page > 3) {
        this.pages.push(0); // dots
      }
    }

    for (let plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages) continue;
      if (plength < 1) plength = 1;
      this.pages.push(plength);
    }

    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        this.pages.push(0); // dots
      }
      this.pages.push(totalPages); // last page
    }

    if (page < totalPages) {
      this.pages.push(-2); // next button
    }
  }

  onPageChange(page: number): void {
    // Logic to change the page goes here
  }

}
