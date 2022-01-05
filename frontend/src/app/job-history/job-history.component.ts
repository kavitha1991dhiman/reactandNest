import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { JobService } from '../review-info/service/job.service';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.css']
})
export class JobHistoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'status', 'timeofrun'];
  // dataSource = ELEMENT_DATA;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private jobservice: JobService) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs() {
    this.jobservice.getJobHistory().subscribe(
      data => {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    );
  }


}
