const { Router } = require("express");
const NotesController = require("../controller/NotesController");

const notesRoutes = Router();
const notesController = new NotesController();

notesRoutes.get("/:id", notesController.show);
notesRoutes.post("/:user_id", notesController.create);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;
