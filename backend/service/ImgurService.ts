import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {HttpInterface} from "../externalAPI/HttpInterface";
import {ExternalInterfaceError} from "../errors/ExternalInterfaceError";

const TOKEN = 'faf88da0b48658a09e9fce28e6659a3b7c2310ff';
const IMGUR_URL = 'https://api.imgur.com/3/image';

export class ImgurService {
    private readonly imgurUrl: string;
    private httpInterface: HttpInterface;

    constructor(httpInterface: HttpInterface) {
        this.httpInterface = httpInterface;
        this.imgurUrl = IMGUR_URL;
    }

    public uploadPhoto = async (photo: Express.Multer.File) => {
        switch (photo.mimetype) {
            case 'blob':
                return await this.uploadBlob(photo);
            case 'base64':
                return await this.uploadBase64(photo);

            default:
                throw new InvalidArgumentsError('Invalid mimetype.');
        }
    }

    public deletePhoto = async (photoHash: string) => {
        await this.httpInterface.delete(`${this.imgurUrl}/${photoHash}`, {headers: this.getAuthorizationHeader()});
        if (!this.httpInterface.responseWasSuccessful()) throw new ExternalInterfaceError('Error deleting photo.');
    }

    private uploadBlob = async (photo: Express.Multer.File) => {
        return await this.setUpAndSendRequest({ image: photo, type: 'blob' }, { headers: this.getAuthorizationHeader() });
    }

    private uploadBase64 = async (photo: Express.Multer.File) => {
        const fileBuffer = photo.buffer;
        const base64Image = fileBuffer.toString('base64');

        return await this.setUpAndSendRequest({ image: base64Image, type: 'base64' }, { headers: this.getAuthorizationHeader() });
    }

    //Devolvera el hash de la foto subida si salio ok.
    private setUpAndSendRequest = async <T, J>(data: T, headers: J) => {
        await this.sendUploadRequest(data, headers);
        if (!this.httpInterface.responseWasSuccessful()) throw new ExternalInterfaceError('Error uploading photo.');

        const responseData = this.httpInterface.getResponseData();
        return responseData.data.data.id;
    }

    private sendUploadRequest = async <T, J>(data: T, headers: J) => {
        return await this.httpInterface.post(this.imgurUrl, data, headers);
    }

    private getAuthorizationHeader = () => {
        return { Authorization: `Bearer ${TOKEN}` };
    }
}