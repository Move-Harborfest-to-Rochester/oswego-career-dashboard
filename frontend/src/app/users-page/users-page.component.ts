import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { User } from "../security/domain/user";
import { UsersSearchResponseJSON } from "./user-search-result";
import { PageEvent } from "@angular/material/paginator";
import { debounceTime, Observable, Subject } from "rxjs";
import { ScreenSizeService } from "../util/screen-size.service";
import { AuthService } from "../security/auth.service";
import { UserService } from '../security/user.service';
import { ArtifactService } from "../file-upload/artifact.service";
import { MatSelect } from '@angular/material/select';
import {YearLevel} from "../../domain/Milestone";

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.less']
})
export class UsersPageComponent implements OnInit, OnDestroy {

  // placeholder profile pic site
  profilePicURLBase = 'https://i.pravatar.cc/';

  mobileColumns: string[] = ['picture', 'name', 'year', 'buttons'];
  desktopColumns: string[] = ['picture', 'name', 'year', 'email', 'role', 'buttons'];

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]); // Uses MatTableDataSource for filtering

  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';
  private searching$ = new Subject<void>();
  isMobile$: Observable<boolean>;

  user$: Observable<User | null>;

  // Drop down Menu
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSelect) yearFilter!: MatSelect;

  selectedYear: number | null = null; // Track the selected year
  availableYears: String[] = [YearLevel.Freshman, YearLevel.Sophomore, YearLevel.Junior, YearLevel.Senior];

  constructor(
    private readonly userService: UserService,
    private screenSizeSvc: ScreenSizeService,
    private readonly authService: AuthService,
    private artifactSvc: ArtifactService,
  ) {
    this.isMobile$ = this.screenSizeSvc.isMobile$;
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.pageSize = Number(localStorage.getItem('pageSize') ?? 10);
    this.loadData();
    this.searching$.pipe(
      debounceTime(500), // Debounce for 1 second
    )
      .subscribe(() => {
          this.currentPage = 0; // Reset to first page when searching
          this.loadData();
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      if (!filter) return true; // If no filter is selected, show all rows

      const year = data.studentDetails?.yearLevel?.toString();
      return year === filter;
    };
  }

  ngOnDestroy() {
    this.searching$.complete();
  }

  // Method to fetch data from API
  loadData(): void {
    this.userService.searchUsers(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe((searchResults: UsersSearchResponseJSON) => {
        this.dataSource.data = searchResults.users.map((u) => new User(u));
        this.totalItems = searchResults.totalResults;
        this.dataSource.data.forEach((user: User) => {
          if (user.profilePictureId != null) {
            this.artifactSvc.getArtifactFile(user.profilePictureId)
              .subscribe((blob) => {
                user.profilePictureURL = URL.createObjectURL(blob);
              })
          }
        });

        // Apply the year filter after loading data
        this.applyYearFilter();
      });
  }

  // Method to handle page change
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex; // pageIndex starts from 0
    this.pageSize = event.pageSize;
    localStorage.setItem('pageSize', this.pageSize.toString())
    this.loadData();
  }

  // Method to handle search
  onSearch(): void {
    this.searching$.next();
  }

  // Method to apply year filter
  applyYearFilter(): void {
    this.dataSource.filter = this.selectedYear?.toString() || ''; // Apply filter
  }
}
