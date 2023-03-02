import { Request, Response } from "express";
import { AuthRequest } from "core_api/middlewares/auth.middleware";
import AuthService from "./auth.service";

async function login(req: Request, res: Response) {
    try {
        if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
            res.json(await AuthService.login(req.body.email, req.body.password))
        } else {
            res.status(400).json({message: 'email or password not send'})
        }
    } catch(err) {
        console.error(err)
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

async function verify(req: AuthRequest, res: Response) {
    res.json(req['auth']);
}


export default {
    login,
    register,
    verify
}