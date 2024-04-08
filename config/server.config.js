import env from "../env.js";

env(process.env['APP_ENV'])
export const RCE_SERVER = process.env['RCE_SERVER'] || 'http://localhost:5000/run'

export const PORT = process.env.PORT || 3000;