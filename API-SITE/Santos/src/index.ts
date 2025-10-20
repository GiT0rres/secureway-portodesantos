import crateApp from "./app"
import { sequelize } from "./repositories/repoConfig"
import { Users } from "./models/userModel"
import { Esp } from "./models/espModel"
import { Scheduling } from "./models/schedulingModel"
import { Read } from "./models/readModel"
import { Enterprise } from "./models/enterpriseModel"
import { PersistentSession } from "./models/persistent-session-model";

const app = crateApp()
const port = 3034

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

sequelize.authenticate()
    .then(() => console.log("✅ Conexão com o banco estabelecida"))
    .catch((err) => console.log("❌ Erro ao conectar no banco:", err));

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
    await PersistentSession.sync({
        "alter": true
    })
}

syncDatabase()