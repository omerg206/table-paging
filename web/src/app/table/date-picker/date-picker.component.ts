import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface DateRange {
  start: Date | string | number |  null;
  end: Date | string | number |null;
}
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @Output() dateChange: EventEmitter<DateRange | null> = new EventEmitter<DateRange | null>();

  constructor() { }


  ngOnInit() {
  }

  onCalenderClose() {
    this.dateChange.emit(this.range.value);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
