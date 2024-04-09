import jwt from 'jsonwebtoken'
import { Coder } from '../../auth/models/Coder.js';
import { roles } from './roles.js';
import { Manager } from '../../auth/models/Manager.js';

export const authorize = (allowedRoles = []) => {
    // allowedRoles param can be a single role string (e.g. Role.User or 'User')
    if (typeof allowedRoles === 'string') {
        allowedRoles = [allowedRoles];
    }
    return (req, res, next) => {
        const authHeaders = req.headers["authorization"]
        const token = authHeaders && authHeaders.split(" ")[1]
        if (!token) return res.sendStatus(401) // Unauthorized
        jwt.verify(token, 'secret', async (err, payload) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid token'
                })
            }
            // Search for coder
            try {
                const coder = await Coder.findById(payload.id).exec()
                if (coder) {
                    req.user = {
                        id: payload.id,
                        role: roles.Coder,
                    }
                    console.log(req.user)
                }
                const manager = await Manager.findById(payload.id).exec()
                if (manager) {
                    req.user = {
                        id: payload.id,
                        role: roles.Manager,
                    }
                }
                if (req.user) {
                    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
                        return res.status(401).json({
                            message: 'Unauthorized role'
                        })
                    }
                    return next()
                }
                return res.status(401).json({
                    message: 'Authorization failed'
                }) 
            } catch (error) {
                return res.status(401).json({
                    message: 'Authorization failed'
                })
            }
        })
        
    };
}