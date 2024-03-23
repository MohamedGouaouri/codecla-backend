import jwt from 'jsonwebtoken'

export const authorize = (roles = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User')
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        const authHeaders = req.headers["authorization"]
        const token = authHeaders && authHeaders.split(" ")[1]
        if (token == null) return res.sendStatus(401) // Unauthorized
        let responseSent = false
        jwt.verify(token, 'secret', (err, user) => {
            if (err) {
                responseSent = true
                return res.status(403).json({
                    message: 'Invalid token'
                })
            }
            req.user = user
        })
        if (roles.length && (!req.user || !roles.includes(req.user.role))) {
            return !responseSent && res.status(401).json({
                message: 'Unauthorized role'
            })
        }
        next();
    };
}