import { pool } from "../db.js";
import { Storage } from "@google-cloud/storage";
import Multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { log } from "console";

export const getColaborador = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Colaborador WHERE Activo=1");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
export const getEquipo = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Equipo");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
export const getLider = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Lider");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
export const getPlanificador = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Planificador");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM employee WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, salary } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO employee (name, salary) VALUES (?, ?)",
      [name, salary]
    );
    res.status(201).json({ id: rows.insertId, name, salary });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
const uploadImage = () => {
  // Get the project id and keyfile
  let projectId = "uda-production";
  let keyFilename = path.join(process.cwd(), "../../mykey.json");

  // Create a Storage instance
  const storage = new Storage({
    projectId,
    keyFilename,
  });
  // Get a reference to the bucket
  const bucket = storage.bucket("udamx-storage02");
  // Process the file upload and upload to Google Cloud Storage
  if (req.file) {
    console.log(req.file);
    console.log("File found, trying to upload....");
    // Generate a unique filename
    const uniqueFilename = uuidv4() + path.extname(req.file.originalname);
    console.log(uniqueFilename);
    // Get a reference to the blob
    const blob = bucket.file(`sarym/user/profile-picture/${uniqueFilename}`);
    const blobStream = blob.createWriteStream();
    blobStream.on("finish", () => {
      res.status(200).send("Success");
    });
    blobStream.end(req.file.buffer);
  } else throw "Error with the image";
};

export const createColaborador = async (req, res) => {
  try {
    // Get the project id and keyfile
    let projectId = "uda-production";
    let keyFilename = path.join(process.cwd(), "mykey.json");

    // Create a Storage instance
    const storage = new Storage({
      projectId,
      keyFilename,
    });
    // Get a reference to the bucket
    const bucket = storage.bucket("udamx-storage02");
    // Process the file upload and upload to Google Cloud Storage
    if (!req.file) {
      console.log("No se encontro archivo");
    }

    console.log(req.file);
    console.log("File found, trying to upload....");
    // Generate a unique filename
    const uniqueFilename = uuidv4() + path.extname(req.file.originalname);
    console.log(uniqueFilename);
    const Imagen = `https://storage.cloud.google.com/udamx-storage02/sarym/user/profile-picture/${uniqueFilename}`;
    // Get a reference to the blob
    const blob = bucket.file(`sarym/user/profile-picture/${uniqueFilename}`);
    const blobStream = blob.createWriteStream();
    blobStream.on("finish", () => {
      console.log("Se subio bien :)");
    });
    blobStream.end(req.file.buffer);

    console.log(req.body);
    const {
      ID_Colab,
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Correo,
      Telefono,
      IDEquipo,
      IDLider,
    } = req.body;

    // const Imagen = `src`;
    const Activo = 1;
    const [rows] = await pool.query(
      "INSERT INTO Colaborador (ID_Colab, Nombre, Apellido_pat, Apellido_mat, Correo, Telefono, Imagen, Activo, IDEquipo, IDLider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        ID_Colab,
        Nombre,
        Apellido_pat,
        Apellido_mat,
        Correo,
        Telefono,
        Imagen,
        Activo,
        IDEquipo,
        IDLider,
      ]
    );
    res.status(201).json({
      ID_Colab,
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Correo,
      Telefono,
      Imagen,
      Activo,
      IDLider,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
  // try {
  //   console.log(req.body);
  //   const {
  //     ID_Colab,
  //     Nombre,
  //     Apellido_pat,
  //     Apellido_mat,
  //     Correo,
  //     Telefono,
  //     IDEquipo,
  //     IDLider,
  //     FotoColab,
  //   } = req.body;

  //   // const Imagen = `https://storage.cloud.google.com/udamx-storage02/sarym/user/profile-picture/${uniqueFilename}`;
  //   const Imagen = `src`;
  //   const Activo = 1;
  //   const [rows] = await pool.query(
  //     "INSERT INTO Colaborador (ID_Colab, Nombre, Apellido_pat, Apellido_mat, Correo, Telefono, Imagen, Activo, IDEquipo, IDLider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  //     [
  //       ID_Colab,
  //       Nombre,
  //       Apellido_pat,
  //       Apellido_mat,
  //       Correo,
  //       Telefono,
  //       Imagen,
  //       Activo,
  //       IDEquipo,
  //       IDLider,
  //     ]
  //   );
  //   res.status(201).json({
  //     ID_Colab,
  //     Nombre,
  //     Apellido_pat,
  //     Apellido_mat,
  //     Correo,
  //     Telefono,
  //     Imagen,
  //     Activo,
  //     IDLider,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({ message: "Something goes wrong" + error });
  // }
};
export const createCambaceoDaily = async (req, res) => {
  try {
    console.log(req.body);
    const {
      ID,
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Correo,
      Telefono,
      IDEquipo,
      IDLider,
    } = req.body;
    const IDPlanificador = "1698765435";
    const Imagen = "src";
    const [rows] = await pool.query(
      "INSERT INTO Colaborador (ID, Nombre, Apellido_pat, Apellido_mat, Correo, Telefono, Imagen, IDPlanificador, IDEquipo, IDLider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        ID,
        Nombre,
        Apellido_pat,
        Apellido_mat,
        Correo,
        Telefono,
        Imagen,
        IDPlanificador,
        IDEquipo,
        IDLider,
      ]
    );
    res.status(201).json({
      ID,
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Correo,
      Telefono,
      Imagen,
      IDPlanificador,
      IDLider,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};
export const createPlaneador = async (req, res) => {
  try {
    // Get the project id and keyfile
    let projectId = "uda-production";
    let keyFilename = path.join(process.cwd(), "mykey.json");

    // Create a Storage instance
    const storage = new Storage({
      projectId,
      keyFilename,
    });
    // Get a reference to the bucket
    const bucket = storage.bucket("udamx-storage02");
    // Process the file upload and upload to Google Cloud Storage
    if (!req.file) {
      console.log("No se encontro archivo");
    }

    console.log(req.file);
    console.log("File found, trying to upload....");
    // Generate a unique filename
    const uniqueFilename = uuidv4() + path.extname(req.file.originalname);
    console.log(uniqueFilename);
    const Documentos = `https://storage.cloud.google.com/udamx-storage02/sarym/general-docs/${uniqueFilename}`;
    // Get a reference to the blob
    const blob = bucket.file(`sarym/general-docs/${uniqueFilename}`);
    udamx - storage02 / sarym / general - docs;
    const blobStream = blob.createWriteStream();
    blobStream.on("finish", () => {
      console.log("Se subio bien :)");
    });
    blobStream.end(req.file.buffer);
    console.log(req.body);
    const {
      ID,
      Tipo,
      FechaAsignacion,
      FechaConclusion,
      Descripcion,
      NombreCompleto,
      TipoEmpresa,
      Sitioweb,
      Telefono,
      IDColaborador,
      Incidentes,
      FechaSeguimiento,
      Direccion_Calle,
      Direccion_Num_Ext,
      Direccion_Num_Int,
      Direccion_CP,
      Direccion_Colonia,
    } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO Planeador (ID, Tipo, FechaAsignacion, FechaConclusion, Descripcion, Documentos, NombreCompleto, TipoEmpresa, Sitioweb, Telefono, IDColaborador, Incidentes, FechaSeguimiento, Direccion_Calle, Direccion_Num_Ext, Direccion_Num_Int, Direccion_CP, Direccion_Colonia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        ID,
        Tipo,
        FechaAsignacion,
        FechaConclusion,
        Descripcion,
        Documentos,
        NombreCompleto,
        TipoEmpresa,
        Sitioweb,
        Telefono,
        IDColaborador,
        Incidentes,
        FechaSeguimiento,
        Direccion_Calle,
        Direccion_Num_Ext,
        Direccion_Num_Int,
        Direccion_CP,
        Direccion_Colonia,
      ]
    );
    res.status(201).json({
      ID,
      Tipo,
      FechaAsignacion,
      FechaConclusion,
      Descripcion,
      Documentos,
      NombreCompleto,
      TipoEmpresa,
      Sitioweb,
      Telefono,
      IDColaborador,
      Incidentes,
      FechaSeguimiento,
      Direccion_Calle,
      Direccion_Num_Ext,
      Direccion_Num_Int,
      Direccion_CP,
      Direccion_Colonia,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary } = req.body;

    const [result] = await pool.query(
      "UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?",
      [name, salary, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Employee not found" });

    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);

    // res.json(rows[0]);
    res.status(201).json({ rows });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
export const updateColab = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Nombre,
      Apellido_pat,
      Apellido_mat,
      Correo,
      Telefono,
      IDEquipo,
      IDLider,
    } = req.body;
    console.log("Nombre: " + JSON.stringify(req.body) + "ID: " + id);
    const [result] = await pool.query(
      // "UPDATE Colaborador SET Nombre = $1, Apellido_pat = $2,Apellido_mat = $3, Correo = $4,Telefono = $5, IDEquipo = $6,IDLider = $7 WHERE ID = $8",
      "UPDATE Colaborador SET Nombre = IFNULL(?, Nombre), Apellido_pat = IFNULL(?, Apellido_pat),Apellido_mat = IFNULL(?, Apellido_mat), Correo = IFNULL(?, Correo),Telefono = IFNULL(?, Telefono), IDEquipo = IFNULL(?, IDEquipo),IDLider = IFNULL(?, IDLider) WHERE ID_Colab = ?",
      [
        Nombre,
        Apellido_pat,
        Apellido_mat,
        Correo,
        Telefono,
        IDEquipo,
        IDLider,
        id,
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Colaborador no encontrado" });

    const [rows] = await pool.query(
      "SELECT * FROM Colaborador WHERE ID_Colab = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something goes wrong" + error,
    });
  }
};

export const getSeguimientoDiario = async (req, res) => {
  console.log("Hola");
  try {
    console.log(req.body);
    const { id, fecha } = req.body;
    const [result] = await pool.query("call ObtenerCambaceoDiario(?,?)", [
      id,
      fecha,
    ]);
    console.log(result[0]);
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" + error });
  }
};


//const db = require('../db');

export const getSeguimientoLlamada = (req, res) => {
  const sql = "SELECT * FROM Planificador WHERE tipo = 'Llamada'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener empleados de tipo 'llamada':", err);
      return res.status(500).json({ error: "Error al obtener empleados de tipo 'llamada'" });
    }
    res.json(results);
  })
};

export const createLlamada = async (req, res) => {
  try {
    console.log(req.body);

    const { Tipo,
      FechaAsignacion,
      FechaConclusion, 
      Descripcion,
      Documentos,
      NombreCompleto, 
      Telefono, 
      IDColaborador,
      Direccion_Calle
    } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO Planificador (Tipo, FechaAsignacion, FechaConclusion, Descripcion, Documentos, NombreCompleto, Telefono, IDColaborador, Direccion_Calle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [Tipo,
        FechaAsignacion,  
        FechaConclusion,
        Descripcion,
        Documentos,
        NombreCompleto, 
        Telefono, 
        IDColaborador,
        Direccion_Calle,
      ]
    );
    res.status(201).json({ Tipo,
      FechaAsignacion,  
      FechaConclusion,
      Descripcion,
      Documentos,
      NombreCompleto, 
      Telefono, 
      IDColaborador,
      Direccion_Calle,
       });
  } catch (error) {
    console.error('Error creating llamada:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
