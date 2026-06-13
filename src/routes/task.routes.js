import { Router } from "express";
import { 
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
} from "../controllers/task.controllers.js";
import { verifyJWT, validateProjectPermission } from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";
import upload from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validator.middleware.js";
import {
    createTaskValidator,
    updateTaskValidator,
    createSubTaskValidator
} from "../validators/index.js";

const router = Router();
router.use(verifyJWT); // All task routes are secured

// Task routes
router
    .route("/:projectId")
    .get(validateProjectPermission(Object.values(UserRolesEnum)), getTasks)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        upload.array("attachments", 5),
        createTaskValidator(),
        validate,
        createTask
    );

router
    .route("/:projectId/t/:taskId")
    .get(validateProjectPermission(Object.values(UserRolesEnum)), getTaskById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        updateTaskValidator(),
        validate,
        updateTask
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        deleteTask
    );

// Subtask routes
router
    .route("/:projectId/t/:taskId/subtasks")
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        createSubTaskValidator(),
        validate,
        createSubTask
    );

router
    .route("/:projectId/st/:subTaskId")
    .put(validateProjectPermission(Object.values(UserRolesEnum)), updateSubTask)
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        deleteSubTask
    );

export default router;
