import dotenv from "dotenv";


function envLoader(env = 'dev') {
    switch (env) {
        case "dev":
            return dotenv.config({
                path: '.env.dev'
            })
        case "test":
            return dotenv.config({
                path: '.env.test'
            })
        case "prod":
            return dotenv.config({
                path: '.env.prod'
            })
        default:
            return dotenv.config({
                path: '.env.dev'
            })
    }
}

export default envLoader