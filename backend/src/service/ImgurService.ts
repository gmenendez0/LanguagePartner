import {HttpInterface} from "../externalAPI/HttpInterface";
import {ExternalInterfaceError} from "../errors/ExternalInterfaceError";
import {IMGUR_TOKEN} from "../config/constants";

const TOKEN = IMGUR_TOKEN;
const IMGUR_URL = 'https://api.imgur.com/3/image';

export class ImgurService {
    private readonly imgurUrl: string;
    private httpInterface: HttpInterface;

    constructor(httpInterface: HttpInterface) {
        this.httpInterface = httpInterface;
        this.imgurUrl = IMGUR_URL;
    }

    /**
     * @function uploadPhoto
     * @description Uploads a photo to Imgur.
     *
     * @param {Express.Multer.File} photo - The photo file to be uploaded.
     *
     * @returns {Promise<string>} The hash of the uploaded photo if successful.
     * @throws {ExternalInterfaceError} Throws an error if the upload fails.
     */
    public uploadPhoto = async (photo: Express.Multer.File): Promise<string> => {
        switch (photo.mimetype) {
            case 'blob':
                return await this.uploadBlob(photo);
            default:
                return await this.uploadBase64(photo);
        }
    }

    /**
     * @function deletePhoto
     * @description Deletes a photo from Imgur by its hash.
     *
     * @param {string} photoHash - The hash of the photo to be deleted.
     *
     * @returns {Promise<void>}
     * @throws {ExternalInterfaceError} Throws an error if the deletion fails.
     */
    public deletePhoto = async (photoHash: string): Promise<void> => {
        await this.httpInterface.delete(`${this.imgurUrl}/${photoHash}`, {headers: this.getAuthorizationHeader()});
        if (!this.httpInterface.responseWasSuccessful()) throw new ExternalInterfaceError('Error deleting photo.');
    }

    /**
     * @function uploadBlob
     * @description Uploads a photo as a blob to Imgur.
     *
     * @param {Express.Multer.File} photo - The photo file to be uploaded as a blob.
     *
     * @returns {Promise<string>} The hash of the uploaded photo if successful.
     * @throws {ExternalInterfaceError} Throws an error if the upload fails.
     */
    private uploadBlob = async (photo: Express.Multer.File): Promise<string> => {
        return await this.setUpAndSendRequest({ image: photo, type: 'blob' }, { headers: this.getAuthorizationHeader() });
    }

    /**
     * @function uploadBase64
     * @description Uploads a photo as a base64 encoded string to Imgur.
     *
     * @param {Express.Multer.File} photo - The photo file to be uploaded as a base64 encoded string.
     *
     * @returns {Promise<string>} The hash of the uploaded photo if successful.
     * @throws {ExternalInterfaceError} Throws an error if the upload fails.
     */
    private uploadBase64 = async (photo: Express.Multer.File): Promise<string> => {
        const fileBuffer = photo.buffer;
        const base64Image = fileBuffer.toString('base64');

        return await this.setUpAndSendRequest({ image: base64Image, type: 'base64' }, { headers: this.getAuthorizationHeader() });
    }

    /**
     * @function setUpAndSendRequest
     * @description Sets up and sends an upload request to Imgur.
     *
     * @template T - The type of the data to be sent in the request body.
     * @template J - The type of the headers to be sent with the request.
     * @param {T} data - The data to be sent in the request body.
     * @param {J} headers - The headers to be sent with the request.
     *
     * @returns {Promise<string>} The hash of the uploaded photo if successful.
     * @throws {ExternalInterfaceError} Throws an error if the upload fails.
     */
    private setUpAndSendRequest = async <T, J>(data: T, headers: J): Promise<string> => {
        await this.sendUploadRequest(data, headers);
        if (!this.httpInterface.responseWasSuccessful()) throw new ExternalInterfaceError('Error uploading photo.');

        const responseData = this.httpInterface.getResponseData();
        return responseData.data.id;
    }

    /**
     * @function sendUploadRequest
     * @description Sends an upload request to Imgur.
     *
     * @template T - The type of the data to be sent in the request body.
     * @template J - The type of the headers to be sent with the request.
     * @param {T} data - The data to be sent in the request body.
     * @param {J} headers - The headers to be sent with the request.
     *
     * @returns {Promise<void>}
     */
    private sendUploadRequest = async <T, J>(data: T, headers: J): Promise<void> => {
        return await this.httpInterface.post(this.imgurUrl, data, headers);
    }

    /**
     * @function getAuthorizationHeader
     * @description Constructs the authorization header for Imgur API requests.
     *
     * @returns {{ Authorization: string }} The authorization header.
     */
    private getAuthorizationHeader = (): { Authorization: string; } => {
        return { Authorization: `Bearer ${TOKEN}` };
    }
}