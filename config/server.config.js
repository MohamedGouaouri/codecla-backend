import dotenv from 'dotenv'

dotenv.config();

export const PY_RCE_SERVER = process.env['PY_RCE_SERVER'] || 'http://localhost:5000/run'
export const JS_RCE_SERVER = process.env['JS_RCE_SERVER'] || 'http://localhost:5001/run'


export const PORT = process.env.PORT || 3000;