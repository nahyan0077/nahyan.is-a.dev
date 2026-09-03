import { Router } from 'express'
import { PROJECT_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { requireAuth } from '@api/middlewares/auth.middleware'
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  ReorderProjectsSchema,
} from '@api/schemas/project.schema'
import type { ProjectsController } from '@api/controllers/projects.controller'

export function createProjectsRouter(controller: ProjectsController): Router {
  const router = Router()

  // Static routes — order matters: specific before dynamic
  router.get(PROJECT_ROUTES.FEATURED, controller.getFeatured)
  router.get(PROJECT_ROUTES.ADMIN, requireAuth, controller.getAll)
  router.get(
    PROJECT_ROUTES.REORDER,
    requireAuth,
    validate(ReorderProjectsSchema),
    controller.reorder,
  )
  router.get(PROJECT_ROUTES.ROOT, controller.getPublished)
  router.get(PROJECT_ROUTES.BY_SLUG, controller.getBySlug)

  // Mutations — protected
  router.post(PROJECT_ROUTES.ROOT, requireAuth, validate(CreateProjectSchema), controller.create)
  router.patch(PROJECT_ROUTES.BY_ID, requireAuth, validate(UpdateProjectSchema), controller.update)
  router.patch(PROJECT_ROUTES.PUBLISH, requireAuth, controller.publish)
  router.patch(PROJECT_ROUTES.UNPUBLISH, requireAuth, controller.unpublish)
  router.patch(PROJECT_ROUTES.RESTORE, requireAuth, controller.restore)
  router.patch(PROJECT_ROUTES.FEATURE, requireAuth, controller.feature)
  router.patch(PROJECT_ROUTES.UNFEATURE, requireAuth, controller.unfeature)
  router.delete(PROJECT_ROUTES.BY_ID, requireAuth, controller.delete)

  return router
}
