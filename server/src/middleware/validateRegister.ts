import { Request, Response, NextFunction } from 'express';


const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Alla fält (e-post, användarnamn, lösenord) måste fyllas i." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Ogiltig e-postadress." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Lösenordet måste vara minst 6 tecken." });
    }

    next();
}

export default validateRegister;
  
