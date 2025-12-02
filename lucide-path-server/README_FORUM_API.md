Forum API - quick manual test guide

This document lists the forum endpoints added for quick manual verification.

Base URL: http://localhost:3001/api/forum

1) List threads (public)
  GET /api/forum
  Optional query params: page, limit, search, tag, all=true (admin view includes non-active)

  curl example:
  curl "http://localhost:3001/api/forum?page=1&limit=10"

2) Get single thread (public)
  GET /api/forum/:id

3) Create thread (requires user authentication token cookie or Authorization header)
  POST /api/forum
  body: { title, body, tags: ['anxiety'] }

  curl example (assumes a cookie token exists):
  curl -X POST -H "Content-Type: application/json" -d '{"title":"Test","body":"hello"}' -b cookiefile http://localhost:3001/api/forum

4) Add post to thread
  POST /api/forum/:id/posts
  body: { content }

5) Flag thread (user)
  POST /api/forum/:id/flag

6) Moderation actions (provider admin only): list flagged
  GET /api/forum/moderation/flagged

7) Moderate thread
  POST /api/forum/moderation/thread/:id body: { action: 'delete'|'restore'|'archive'|'pin'|'unpin' }

8) Moderate post
  POST /api/forum/moderation/post/:postId body: { action: 'delete'|'restore'|'flag' }

Notes:
- Endpoints rely on existing auth flows. Use provider auth for admin moderation routes.
