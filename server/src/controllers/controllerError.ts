import { Response } from "express";

type ControllerError = {
  name: string;
  message?: string;
  path?: string;
};

export const handleControllerError = (
  res: Response,
  error: unknown,
  fallbackMessage: string,
) => {
  if (typeof error === "object" && error !== null && "name" in error) {
    const err = error as ControllerError;

    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    if (err.name === "CastError") {
      if (err.path === "_id") {
        return res.status(404).json({ error: "Invalid id-format" });
      }

      return res.status(400).json({ error: `Invalid value for ${err.path}` });
    }
  }

  return res.status(500).json({
    message: fallbackMessage,
    error: error instanceof Error ? error.message : error,
  });
};
