import {
  Component, DestroyRef, OnInit, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './blog-feed.component.html',
  styleUrls: [ './blog-feed.component.scss' ]
})
export class BlogFeedComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  blogPosts: any[] = [];

  ngOnInit() {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ blogPosts }) => {
        console.log('blogPosts', blogPosts);
        this.blogPosts = blogPosts;
      });
  }

}
