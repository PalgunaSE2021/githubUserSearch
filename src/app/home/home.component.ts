import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { ProfileComponent } from '../profile/profile.component';
import { GitHubService } from '../services/github.service';
import { GithubRepos, GithubUser } from '../models/github-user.model';
import { UserReposComponent } from '../repos/repos.component';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    ProfileComponent,
    UserReposComponent,
    LoadingComponent,
  ],
  providers: [GitHubService],
})
export class HomeComponent {
  user: GithubUser | null = null;
  repos: GithubRepos | null = null;
  searchQuery: string = '';
  isLoading: boolean = false;

  constructor(private gitHubService: GitHubService) {}

  getUserDetails(userName: string) {
    if (!!userName) {
      this.isLoading = true;
      this.gitHubService
        .searchUser(userName)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((response) => {
          this.user = {
            userName: response.login,
            name: response.name,
            avatarUrl: response.avatar_url,
            bio: response.bio,
            htmlUrl: response.html_url,
          };
        });
    }
  }

  onSearch(username: string) {
    this.getUserDetails(username);
    this.searchQuery = username;
  }
}
