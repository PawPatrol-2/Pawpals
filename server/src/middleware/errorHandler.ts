import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    console.log("ERROR NAME:", err?.name);
    console.log("ERROR MESSAGE:", err?.message);
    console.log("FULL ERROR:", err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message
    })
    return; }
     else { res.status(500).json({
        error: "Internal Server Error"
    })
    }
}