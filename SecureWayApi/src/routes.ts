// routes.ts
import { Router } from "express";
import * as userController from "./controller/userController"
import * as espController from "./controller/espController"
import * as schedulingController from "./controller/schedulingController"
import * as readController from "./controller/readController"
import * as enterpriseController from "./controller/enterpriseController"
// NOVOS MIDDLEWARES FIREBASE:
import { requireUser, requireEnterprise, requireAuth } from "./middlewares/firebase-auth-middleware";

const router = Router()

// routes.ts - ADICIONE ESTA LINHA
router.get("/debug-auth", userController.debugAuth) 
router.get("/debug-firebase", userController.debugFirebaseAdmin) 

// ========== ROTAS PÚBLICAS ==========
router.post("/users/login", userController.login)
router.post("/users", userController.postUser)
router.post("/enterprise/login", enterpriseController.loginEnterprise) 
router.post("/enterprise", enterpriseController.postEnterprise)

// ========== ROTAS PARA USUÁRIOS ==========
router.get("/users", requireUser, userController.getUser)
router.get("/users/:id", requireUser, userController.getUserID)
router.patch("/users/:id", requireUser, userController.patchUser)
router.delete("/users/:id", requireUser, userController.deleteUserID)
router.get("/user/getname", requireUser, userController.getName)
router.get("/user/isAuthed", requireUser, userController.isAuthed)
router.post("/user/logout", requireUser, userController.logout)

// Rotas específicas do sistema antigo (protegidas)
router.get("/canAccess/:id", requireUser, userController.getAccessVerification)
router.patch("/addKeytoUser/:id_U/:id_E", requireUser, userController.patchAddKeytoUser)

// ========== ROTAS PARA ENTERPRISES ==========
router.get("/enterprise", enterpriseController.getEnterprise)
router.get("/enterprise/:id", enterpriseController.getEnterpriseID)
router.patch("/enterprise/:id", requireEnterprise, enterpriseController.patchEnterprise)
router.delete("/enterprise/:id", requireEnterprise, enterpriseController.deleteEnterpriseID)

// ========== ROTAS PARA ESP ==========
router.get("/esp", espController.getEsp)
router.get("/esp/:id", espController.getEspID)
router.post("/esp", espController.postEsp)
router.patch("/esp/:id", espController.patchEsp)
router.delete("/esp/:id", espController.deleteEspID)

// ========== ROTAS PARA AGENDAMENTO ==========
router.get("/scheduling", schedulingController.getScheduling)
router.get("/scheduling/:id", schedulingController.getSchedulingId)
router.post("/scheduling", requireUser, schedulingController.postScheduling)
router.patch("/scheduling/:id", requireUser, schedulingController.patchScheduling)
router.delete("/scheduling/:id", requireUser, schedulingController.deleteScheduling)

// ========== ROTAS PARA READ ==========
router.get("/read", readController.getRead)
router.get("/read/:id", readController.getReadId)
router.post("/read", readController.postRead)
router.patch("/read/:id", readController.patchRead)
router.delete("/read/:id", readController.deleteRead)

export default router