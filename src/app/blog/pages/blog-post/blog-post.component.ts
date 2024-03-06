import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation, type OnInit
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [ CommonModule, MatCardModule ],
  templateUrl: './blog-post.component.html',
  styleUrls: [ './blog-post.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BlogPostComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  post!: any;

  ngOnInit(): void {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe(({ post }) => {
        this.post = post;
        this.cdr.markForCheck();
      });
  }

}
