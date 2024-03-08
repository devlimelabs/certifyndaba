import {
  ChangeDetectorRef, Component, OnInit, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButterService } from '../blog/services/butter.service';

@Component({
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './blog-feed.component.html',
  styleUrls: [ './blog-feed.component.scss' ]
})
export class BlogFeedComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);

  blogPosts: any[] = [];

  ngOnInit() {
    ButterService.post.list({
      page: 1,
      page_size: 10
    }).then(({ data }: any) => {
      this.blogPosts = data ?? [];
      this.cdr.markForCheck();
    });
  }
}
