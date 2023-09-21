import { Router } from "express";
import {
  deleteEmployee,
  getEmployee,
  getColaborador,
  updateEmployee,
  updateColab,
  getLider,
  getEquipo,
  getPlanificador,
  createColaborador,
  createCambaceoDaily,
  createPlaneador,
  getSeguimientoDiario,
} from "../controllers/employees.controller.js";
import multer from "multer";

// const multer = Multer({
//   storage: Multer.memoryStorage(),
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();
// const upload = multer();

// GET all Colaboradores
router.get("/colaborador", getColaborador);

// GET all Lideres
router.get("/lider", getLider);

// GET all Equipos
router.get("/equipo", getEquipo);

// GET all Planificadores
router.get("/planificador", getPlanificador);

// GET An Employee
router.get("/employees/:id", getEmployee);

// DELETE An Employee
router.delete("/employees/:id", deleteEmployee);

// INSERT An Colaborador
router.post("/colaborador", upload.single("FotoColab"), createColaborador);

// INSERT An Colaborador
router.post(
  "/planificador",
  upload.single("documentoCambaceo"),
  createPlaneador
);

// Update An Employee
router.patch("/employees/:id", updateEmployee);

// Update An Employee
router.put("/colaborador/:id", updateColab);

// INSERT Cambaceo
router.post("/cambaceo/diario", createCambaceoDaily);

// Seguimiento Cambaceo Diario
router.post("/cambaceo/seguimientoDiario", getSeguimientoDiario);
// Seguimiento Cambaceo Semanal

//Seguimiento llamada



export default router;
