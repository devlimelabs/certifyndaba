import {
  Component, OnInit, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './blog-feed.component.html',
  styleUrls: [ './blog-feed.component.scss' ]
})
export class BlogFeedComponent implements OnInit {

  private route = inject(ActivatedRoute);

  blogPosts: any[] = [];

  ngOnInit() {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe(({ blogPosts }) => {
        console.log('blogPosts', blogPosts);
        this.blogPosts = blogPosts;
      });
  }

}
