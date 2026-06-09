import { Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import User from "../models/User";
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return res.status(401).json({ message: "Ingen token"})

            const token = authHeader.split(" ")[1]
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

            const user = await User.findById(decoded.userId)
            if (!user || (user as any).role !== "admin") {
            return res.status(403).json({ message: "Endast admin har behörighet"});
            }
            next()
    } catch {
        return res.status(401).json({ message: "Ogiltig token"})
    }
}
