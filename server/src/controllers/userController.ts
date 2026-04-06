import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(401).json({
                message: "Fel användarnamn eller lösenord"
            })
        }

      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch) {
        return res.status(401).json({
            message: "Fel användarnamn eller lösenord"
        })
      } 

        res.status(200).json({
            message: "Inloggningen lyckades!"
        })

    } catch(err: any) {
        res.status(500).json({
            message: "Något gick fel", error: err.message

        })
    }
    
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({
            message: "Användare skapad!", user
        })
    } catch(err: any) {
        if(err.code === 11000) {
            res.status(400).json({
                message: "Användarnamnet är redan taget."
            })
        } else {
            res.status(500).json({
                message: "Något gick fel", error: err.message
            })
        }
    }
}