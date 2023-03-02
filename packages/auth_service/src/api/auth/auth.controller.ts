import { Request, Response } from "express";
import AuthService from "./auth.service";

async function login(req: Request, res: Response) {
    try {
        if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
            res.json(await AuthService.login(req.body.email, req.body.password))
        } else {
            res.status(400).json({message: 'email or password not send'})
        }
    } catch(err) {
        res.status(500).json({ message: err })
    }

}

async function register(req: Request, res: Response) {
    try {
        if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
            res.json(await AuthService.register(req.body));
        } else {
            res.status(400).json({message: 'email or password not send'})
        }
    } catch(err) {
        res.status(500).json({ message: err })
    }
}

async function verify(req: Request, res: Response) {
    const token = req.headers.authorization || req.cookies.token || req.query.token as string;
    const user = await AuthService.verify(token);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(401).end();
    }
}


export default {
    login,
    register,
    verify
}