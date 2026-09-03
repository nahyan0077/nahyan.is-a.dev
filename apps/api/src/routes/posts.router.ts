import { Router } from 'express'
import { POST_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { requireAuth } from '@api/middlewares/auth.middleware'
import { CreatePostSchema, UpdatePostSchema } from '@api/schemas/post.schema'
import type { PostsController } from '@api/controllers/posts.controller'

export function createPostsRouter(controller: PostsController): Router {
  const router = Router()

  // Static routes — order matters: specific before dynamic
  router.get(POST_ROUTES.ADMIN, requireAuth, controller.getAll)
  router.get(POST_ROUTES.ROOT, controller.getPublished)
  router.get(POST_ROUTES.BY_SLUG, controller.getBySlug)

  // Mutations — protected
  router.post(POST_ROUTES.ROOT, requireAuth, validate(CreatePostSchema), controller.create)
  router.patch(POST_ROUTES.BY_ID, requireAuth, validate(UpdatePostSchema), controller.update)
  router.patch(POST_ROUTES.PUBLISH, requireAuth, controller.publish)
  router.patch(POST_ROUTES.UNPUBLISH, requireAuth, controller.unpublish)
  router.delete(POST_ROUTES.BY_ID, requireAuth, controller.delete)

  return router
}
