import {Controller} from "./Controller";
import {userService, UserService} from "../service/UserService";
import {Request, Response} from "express";
import {LP_User} from "../entity/LP_User/LP_User";
import {UpdateLP_UserPublicDataDTO} from "../DTOs/UserDTOs/UpdateLP_UserDTO";
import {ConfigureLP_UserDTO} from "../DTOs/UserDTOs/ConfigureLP_UserDTO";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";

export class UserController extends Controller {
    private service: UserService;

    constructor() {
        super();
        this.service = userService;
    }

    /**
     * @function getUserPublicData
     * @description Retrieves the public data of a user by their ID.
     *
     * @param {Request} req - The request object containing the user ID as a parameter.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the user object (only public data) if the user is retrieved successfully by the service layer, or an error if the retrieval fails.
     */
    public getUserPublicData = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.service.getUserPublicDataById(Number(req.params.id));
            this.okResponse(res, user);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * @function getMe
     * @description Retrieves the public data of the currently authenticated user.
     *
     * @param {Request} req - The request object containing the user's authentication information.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the logged-in user's object if it is retrieved successfully by the service layer, or an error if the retrieval fails.
     */
    public getMe = async (req: Request, res: Response): Promise<void> => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.getUserPublicData(req, res);
    }

    /**
     * @function updateUserPublicData
     * @description Updates the public data of a user by their ID.
     *
     * @param {Request} req - The request object containing the user ID as a parameter and the updated user data in the body.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the updated user object (only public data) if the update is successful, or an error if the update fails.
     */
    private updateUserPublicData = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            const userData = this.convertBodyToDTO(req, UpdateLP_UserPublicDataDTO);

            const user = await this.service.updateUserPublicData(userId, userData);
            this.okResponse(res, user.asPublicDTO());
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * @function updateMe
     * @description Updates the public data of the currently authenticated user.
     *
     * @param {Request} req - The request object containing the updated user data in the body.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the updated user object (only public data) if the update is successful, or an error if the update fails.
     */
    public updateMe = async (req: Request, res: Response): Promise<void> => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.updateUserPublicData(req, res);
    }

    /**
     * @function userIsConfigured
     * @description Checks if a user is configured by their ID.
     *
     * @param {Request} req - The request object containing the user ID as a parameter.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with a boolean indicating if the user is configured, or an error if the check fails.
     */
    private userIsConfigured = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            const isConfigured = await this.service.userIsConfigured(userId);

            this.okResponse(res, isConfigured);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * @function meIsConfigured
     * @description Checks if the currently authenticated user is configured.
     *
     * @param {Request} req - The request object containing the user's authentication information.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with a boolean indicating if the user is configured, or an error if the check fails.
     */
    public meIsConfigured = async (req: Request, res: Response): Promise<void> => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.userIsConfigured(req, res);
    }

    /**
     * @function configureUser
     * @description Configures a user by their ID with the provided configuration data.
     *
     * @param {Request} req - The request object containing the user ID as a parameter and the configuration data in the body.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the configured user object (only public data) if the configuration is successful, or an error if the configuration fails.
     */
    private configureUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            const userConfig = this.convertBodyToDTO(req, ConfigureLP_UserDTO);

            const user = await this.service.configureUser(userId, userConfig);
            this.okResponse(res, user.asPublicDTO());
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * @function configureMe
     * @description Configures the currently authenticated user with the provided configuration data.
     *
     * @param {Request} req - The request object containing the configuration data in the body.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the configured user object (only public data) if the configuration is successful, or an error if the configuration fails.
     */
    public configureMe = async (req: Request, res: Response): Promise<void> => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.configureUser(req, res);
    }

    /**
     * @function updateUserProfilePic
     * @description Updates the profile picture of a user by their ID.
     *
     * @param {Request} req - The request object containing the user ID as a parameter and the profile picture file in the body.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the updated user object (only public data) if the update is successful, or an error if the update fails.
     */
    private updateUserProfilePic = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            const profilePic = req.file;

            if(!profilePic) throw new InvalidArgumentsError('No photo provided');
            if(!userId) throw new InvalidArgumentsError('No user id provided');

            const user = await this.service.updateUserProfilePic(userId, profilePic);
            this.okResponse(res, user.asPublicDTO());
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * @function updateMeProfilePic
     * @description Updates the profile picture of the currently authenticated user.
     *
     * @param {Request} req - The request object containing the profile picture file in the body.
     * @param {Response} res - The response object used to send the result or an error message.
     *
     * @returns {Promise<void>} Returns a 200 OK status with the updated user object (only public data) if the update is successful, or an error if the update fails.
     */
    public updateMeProfilePic = async (req: Request, res: Response): Promise<void> => {
        req.params.id = this.getAuthenticatedUserIdFromRequest(req).toString();
        await this.updateUserProfilePic(req, res);
    }

    /**
     * @function getAuthenticatedUserIdFromRequest
     * @description Retrieves the ID of the currently authenticated user from the request object.
     *
     * @param {Request} req - The request object containing the user's authentication information.
     *
     * @returns {number} The ID of the authenticated user.
     */
    private getAuthenticatedUserIdFromRequest = (req: Request): number => {
        return (req.user as LP_User).getId();
    }
}

export default new UserController();