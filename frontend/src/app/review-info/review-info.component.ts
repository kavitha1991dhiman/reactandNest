import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from './service/job.service';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-review-info',
    templateUrl: './review-info.component.html',
    styleUrls: ['./review-info.component.css'],
})
export class ReviewInfoComponent implements OnInit {
    // tslint:disable-next-line:max-line-length
    displayedColumns: string[] = ['name', 'repo', 'targetBranch', 'scanSchedule', 'actions'];
    // dataSource = ELEMENT_DATA;
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private jobservice: JobService,
        public snackBar: MatSnackBar) {
    }


    ngOnInit() {
        this.getJobs();

    }

    getJobs() {
        this.jobservice.getJobs().subscribe(
            data => {
                this.dataSource = new MatTableDataSource<any>(data);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }
        );
    }

    doDelete(data) {

        this.jobservice.deleteJob(data._id)
            .then(delSuccess => {
                this.snackBar.open('Successfully Deleted:  ' + data.name, 'Dismiss', {
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    panelClass: ['success']
                }).afterDismissed().subscribe(done => {
                    this.dataSource.data = this.dataSource.data.filter(item => {
                        return item._id !== data._id;
                    });
                });
            }).catch(err => {
                this.snackBar.open('Couldn\'t Delete the job for: ' + data.name, 'Dismiss', {
                    //       data: err,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    panelClass: ['error']
                });
            });

    }// end of do delete
}
