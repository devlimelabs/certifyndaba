import { Route } from '@angular/router';
import { BlogFeedComponent } from './pages/blog-feed/blog-feed.component';
import { BlogPostComponent } from './pages/blog-post/blog-post.component';
import { blogFeedResolver } from './pages/blog-feed/blog-feed.resolver';
import { blogPostResolver } from './pages/blog-post/blog-post.resolver';

export const BlogRoutes: Route[] = [
  {
    path: '',
    component: BlogFeedComponent,
    resolve: {
      blogPosts: blogFeedResolver
    }
  },
  {
    path: ':slug',
    component: BlogPostComponent,
    resolve: {
      post: blogPostResolver
    }
  }
];
