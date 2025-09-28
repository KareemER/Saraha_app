import cron from "node-cron"
import RevokedToken from "../DB/Models/revoked-tokens.model.js"


cron.schedule("0 0 0 0 *" , async()=>{
    await RevokedToken.deleteMany({expirationDate:{$lt:new Date()}})
})