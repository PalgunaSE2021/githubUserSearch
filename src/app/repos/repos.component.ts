import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GitHubService } from '../services/github.service';
import { GithubRepos } from '../models/github-user.model';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-user-repos',
  standalone: true,
  imports: [CommonModule, MatCardModule, LoadingComponent],
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.scss'],
})
export class UserReposComponent implements OnChanges {
  @Input() userName: string = '';

  repos: GithubRepos[] = [];

  pageNumber: number = 1;

  isLoading: boolean = false;

  constructor(private gitHubService: GitHubService) {}

  redirectToRepo(repourl: string) {
    window.open(repourl);
  }

  getUserRepos(userName: string, page: number = 1, perPage: number = 20) {
    this.isLoading = true;
    this.gitHubService
      .getUserRepos(userName, page, perPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.repos = response.map(({ name, size }: GithubRepos) => ({
          name,
          size,
        }));
      });
  }

  onPrevious() {
    this.pageNumber--;
    this.getUserRepos(this.userName, this.pageNumber);
  }

  onNext() {
    this.pageNumber++;
    this.getUserRepos(this.userName, this.pageNumber);
  }

  onPageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.pageNumber = parseInt(inputElement.value);
    this.getUserRepos(this.userName, this.pageNumber);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('currentUserName: ', changes['userName']?.currentValue);
    if (changes['userName']?.currentValue?.length > 0) {
      this.getUserRepos(changes['userName']?.currentValue);
    }
  }
}
