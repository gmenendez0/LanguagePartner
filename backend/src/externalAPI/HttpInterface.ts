import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {ExternalInterfaceError} from "../errors/ExternalInterfaceError";

export class HttpInterface {
    private lastResponse: AxiosResponse;

    /**
     * @function post
     * @description Sends a POST request to the specified URL with the provided data and headers.
     *
     * @template T - The type of the data to be sent in the request body.
     * @template J - The type of the headers to be sent with the request.
     * @param {string} url - The URL to send the POST request to.
     * @param {T} data - The data to be sent in the request body.
     * @param {J} headers - The headers to be sent with the request.
     *
     * @throws {ExternalInterfaceError} Throws an error if the request fails.
     * @returns {Promise<void>}
     */
    public post = async <T, J>(url: string, data: T, headers: J): Promise<void> => {
        try {
            this.lastResponse = await axios.post(url, data, headers);
        } catch (error) {
            throw new ExternalInterfaceError(this.getErrorMessage(error, url));
        }
    }

    /**
     * @function delete
     * @description Sends a DELETE request to the specified URL with the provided headers.
     *
     * @template T - The type of the headers to be sent with the request.
     * @param {string} url - The URL to send the DELETE request to.
     * @param {T} headers - The headers to be sent with the request.
     *
     * @throws {ExternalInterfaceError} Throws an error if the request fails.
     * @returns {Promise<void>}
     */
    public delete = async <T>(url: string, headers: T): Promise<void> => {
        try {
            this.lastResponse = await axios.delete(url, headers);
        } catch (error) {
            throw new ExternalInterfaceError(this.getErrorMessage(error, url));
        }
    }

    /**
     * @function responseWasSuccessful
     * @description Checks if the last response status was 200 OK.
     *
     * @returns {boolean} Returns true if the last response status was 200 OK, otherwise false.
     */
    public responseWasSuccessful = (): boolean => {
        return this.lastResponse.status === HttpStatusCode.Ok;
    }

    /**
     * @function getResponseData
     * @description Retrieves the data from the last response.
     *
     * @returns {any} The data from the last response. Has to return any because of AxiosResponse type.
     */
    public getResponseData = (): any => {
        return this.lastResponse.data;
    }

    /**
     * @function getErrorMessage
     * @description Constructs an error message for external API errors.
     *
     * @param {Error} e - The error object.
     * @param {string} url - The URL of the external API.
     *
     * @returns {string} The constructed error message.
     */
    private getErrorMessage = (e: Error, url: string): string => {
        return 'Error in external API of URL: ' + url + ". Error detail: " + e.toString();
    }
}