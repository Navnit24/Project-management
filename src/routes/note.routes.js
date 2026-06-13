import { Router } from "express";
import {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} from "../controllers/note.controllers.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";
import validate from "../middlewares/validator.middleware.js";
import { createNoteValidator } from "../validators/index.js";

const router = Router();
router.use(verifyJWT); // All note routes are secured

// Note routes
router
    .route("/:projectId")
    .get(validateProjectPermission(Object.values(UserRolesEnum)), getNotes)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createNoteValidator(),
        validate,
        createNote
    );

router
    .route("/:projectId/n/:noteId")
    .get(validateProjectPermission(Object.values(UserRolesEnum)), getNoteById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createNoteValidator(),
        validate,
        updateNote
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteNote
    );

export default router;
