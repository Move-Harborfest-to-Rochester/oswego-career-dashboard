import { Component, OnDestroy, OnInit } from '@angular/core';
import { Milestone, YearLevel } from "../../../domain/Milestone";
import { MilestoneService } from 'src/app/milestones-page/milestones/milestone.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MilestoneCreateModalComponent } from './milestone-create-modal/milestone-create-modal.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-milestone-main-page',
  templateUrl: './milestone-main-page.component.html',
  styleUrls: ['./milestone-main-page.component.less']
})
export class MilestoneMainPageComponent implements OnDestroy {
  gridCols: number = 3;
  private destroyed$ = new Subject<any>();

  milestonesMap: Map<string, Array<Milestone>> = new Map()

  protected readonly yearLevels = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  constructor(
    private milestoneService: MilestoneService,
    private router: Router,
    public matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed$.next("");
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.milestoneService.getMilestones(true, true)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((milestones: Milestone[]) => {
        this.yearLevels.forEach((yearLevel) => this.milestonesMap.set(yearLevel, new Array<Milestone>()));
        milestones.forEach((milestone) => this.milestonesMap.get(milestone.yearLevel)?.push(milestone));
    });
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.gridCols = 1;
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.gridCols = 2;
      } else {
        this.gridCols = 3;
      }
    });
  }

  /**
   * Navigates to the milestone edit page
   * The name is actually the milestoneID
   */
  editMilestone(name: string) {
    const encodedName = encodeURIComponent(name);
    this.router.navigate(['/admin/milestone-edit', encodedName]);
  }

  /**
   * Creates the new milestone modal and sends it the year level
   */
  openMilestoneCreateModal(yearLevel: YearLevel) {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "75%";
    dialogConfig.width = "50%";
    dialogConfig.data = {
      yearLevel: yearLevel
    }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(MilestoneCreateModalComponent, dialogConfig);
  }

}
