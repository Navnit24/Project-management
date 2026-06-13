import { Router } from "express";
import { addProjectMembers,
    getProjectById,
    getProjects,
    deleteMembers,
    updateMembersRole,
    updateProject,
    deleteProject,
    createProject,
    getProjectMembers } from "../controllers/project.controllers.js";
import validate  from "../middlewares/validator.middleware.js";
import { createProjectValidator,
    addMembertoProjectValidator } from "../validators/index.js";
import { verifyJWT,
    validateProjectPermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT)

router
     .route("/")
     .get(getProjects)
     .post(createProjectValidator(),validate,createProject)

router
     .route("/:projectId")
     .get(validateProjectPermission(AvailableUserRole),getProjectById)
     .put(validateProjectPermission([UserRolesEnum.ADMIN,UserRolesEnum.MEMBER]),createProjectValidator(),validate,updateProject)
     .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject
     )

 router
     .route("/:projectId/members")
     .get(getProjectMembers)
     .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMembertoProjectValidator(),
        validate,
        addProjectMembers
     );   

router
     .route("/:projectId/members/:userId")
     .put(validateProjectPermission([UserRolesEnum.ADMIN]),updateMembersRole)
     .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteMembers
     ); 

export default router;