import { Request, Response, NextFunction} from 'express'
import { ZodType } from 'zod'

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedParams?: unknown;
      validatedQuery?: unknown;
    }
  }
}

interface RequestSchema {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validateRequest = (schema: RequestSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
        const errors: { location: string; field: string; message: string} [] = [] // Skapa tom array som får innehålla objekten
       
        if(schema.body) {
            const result = schema.body.safeParse(req.body)
            if(!result.success) {
                errors.push(
                    ...result.error.issues.map((issue) => ({
                        location: "body",
                        field: issue.path.join('.'),
                        message: issue.message,
                    }))
                )
            } else {
                req.validatedBody = result.data
            }
        }

        if(schema.params) {
            const result = schema.params.safeParse(req.params)
            if(!result.success) {
                errors.push(
                    ...result.error.issues.map((issue) => ({
                         location: "params",
                         field: issue.path.join("."),
                         message: issue.message,
                    }))
                )
            } else {
                req.validatedParams = result.data
            }
        }

        if(schema.query) {
            const result = schema.query.safeParse(req.query)
            if(!result.success) {
                errors.push(
                    ...result.error.issues.map((issue) => ({
                        location: "query",
                        field: issue.path.join("."),
                        message: issue.message,
                    }))
                )
            } else {
                req.validatedQuery = result.data
            }
        }

        if(errors.length > 0) {
            return res.status(400).json({ message: "Validation Error", errors })
        }

        next()
    }