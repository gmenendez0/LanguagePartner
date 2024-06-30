import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {ExternalInterfaceError} from "../errors/ExternalInterfaceError";

export class HttpInterface {
    private lastResponse: AxiosResponse;

    public post = async <T, J>(url: string, data: T, headers: J) => {
        try {
            this.lastResponse = await axios.post(url, data, headers);
        } catch (error) {
            throw new ExternalInterfaceError(this.getErrorMessage(error, url));
        }
    }

    public delete = async <T>(url: string, headers: T) => {
        try {
            this.lastResponse = await axios.delete(url, headers);
        } catch (error) {
            throw new ExternalInterfaceError(this.getErrorMessage(error, url));
        }
    }

    public responseWasSuccessful = () => {
        return this.lastResponse.status === HttpStatusCode.Ok;
    }

    public getResponseData = () => {
        return this.lastResponse.data;
    }

    private getErrorMessage = (e: Error, url: string) => {
        return 'Error in external API of URL: ' + url + ". Error detail: " + e.toString();
    }
}