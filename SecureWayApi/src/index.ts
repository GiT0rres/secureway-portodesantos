import crateApp from "./app"
import { sequelize } from "./repositories/repoConfig"
import { Users } from "./models/userModel"
import { Esp } from "./models/espModel"
import { Scheduling } from "./models/schedulingModel"
import { Read } from "./models/readModel"
import { Enterprise } from "./models/enterpriseModel"

const app = crateApp()
const port = 3034

app.listen(port, ()=>{
    console.log("localhost:" + port)
})

sequelize.authenticate().then(() => console.log("bunda")).catch(() => console.log("pinto"))

async function syncDatabase() {
    await Users.sync({
        "alter": true,
    })
    await Esp.sync({
        "alter": true//dando permisao pra alterar a tabela
    })
    await Scheduling.sync({
        "alter": true
    })
    await Read.sync({
        "alter": true
    })
    await Enterprise.sync({
        "alter": true
    })
}

syncDatabase()