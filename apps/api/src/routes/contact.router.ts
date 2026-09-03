import { Router } from 'express'
import { CONTACT_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { requireAuth } from '@api/middlewares/auth.middleware'
import { ContactSchema } from '@api/schemas/contact.schema'
import type { ContactController } from '@api/controllers/contact.controller'
import { rateLimit } from '@api/middlewares/rate-limit.middleware'

const contactRateLimit = rateLimit(
  5,
  60 * 60_000,
  "you've sent too many messages — please wait an hour before trying again.",
)

export function createContactRouter(controller: ContactController): Router {
  const router = Router()

  // Static routes — order matters: specific before dynamic
  router.get(CONTACT_ROUTES.ADMIN, requireAuth, controller.getAll)

  // Public
  router.post(CONTACT_ROUTES.ROOT, contactRateLimit, validate(ContactSchema), controller.submit)
  router.delete(CONTACT_ROUTES.BY_ID, requireAuth, controller.delete)

  return router
}
