import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";

import { ScheduledTask } from "./model/scheduled-task";
import { MatSnackBar } from "@angular/material";
import { JobService } from "../review-info/service/job.service";

@Component({
  selector: "app-create-schedule",
  templateUrl: "./create-schedule.component.html",
  styleUrls: ["./create-schedule.component.css"]
})
export class CreateScheduleComponent implements OnInit {
  options: FormGroup;

  schedule: ScheduledTask;
  // urlRegEx = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  alphaNumeric = "[a-zA-Z0-9-]*";
  constructor(
    private fb: FormBuilder,
    private jobservice: JobService,
    public snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit() {}

  handleSubmit() {
    this.jobservice
      .createJob(this.options.value)
      .then(success => {
        this.snackBar
          .open(
            "Successfully Created:  " + this.options.value.name,
            "Dismiss",
            {
              verticalPosition: "bottom",
              horizontalPosition: "center",
              panelClass: ["success"]
            }
          )
          .afterDismissed()
          .subscribe(done => {
            this.initForm();
          });
      })
      .catch(err => {
        this.snackBar.open(
          "Couldn't Create: " + this.options.value.name,
          "Dismiss",
          {
            //       data: err,
            verticalPosition: "bottom",
            horizontalPosition: "center",
            panelClass: ["error"]
          }
        );
      });
  }

  private initForm() {
    this.options = this.fb.group({
      hideRequired: false,
      floatLabel: "always",
      name: new FormControl("", [
        Validators.required,
        Validators.pattern(this.alphaNumeric)
      ]),
      repo: new FormControl("", [
        Validators.required,
        Validators.pattern(this.alphaNumeric)
      ]),
      bvtUrl: new FormControl("", [Validators.pattern(this.alphaNumeric)]),
      targetBranch: new FormControl("master", [Validators.required]),
      scanSchedule: new FormControl("", [Validators.required]),
      platformCategory: new FormControl("", [Validators.required])
    });
  }
}
