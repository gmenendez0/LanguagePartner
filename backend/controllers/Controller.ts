import {Response} from "express";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {PersistanceError} from "../errors/PersistanceError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {RepositoryAccessError} from "../errors/RepositoryAccessError";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";
import {AuthenticationError} from "../errors/AuthenticationError";
import {HttpStatusCode} from "axios";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";

const UNHANDLED_ERROR_OBJECT = { error: "Internal server error." };

export abstract class Controller {
    /**
     * Sets the provided object as the response body and sends the response with status code 200.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected okResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.Ok);
    }

    /**
     * Sets the provided object as the response body and sends the response with status code 201.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected createdResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.Created);
    }

    /**
     * Sets the provided object as the response body and sends the response with status code .
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected badRequestResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.BadRequest);
    }

    /**
     * Sets the provided object as the response body and sends the response with status code 401.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected unauthorizedResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.Unauthorized);
    }

    /**
     * Sets the provided object as the response body and sends the response with status code 404.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected notFoundResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.NotFound);
    }

    /**
     * Sets the provided object as the response body and sends the response with status code 500.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    protected internalServerErrorResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.InternalServerError);
    }

    /**
     * Sets the provided object as the response body and sends the response with the given status code.
     * @param res - The Response object to send.
     * @param object - The object to set as the response body.
     * @param statusCode - The status code to send with the response.
     * @throws {Error} If the provided object cannot be converted to the standard body media type.
     */
    private setUpAndSendResponse = (res: Response, object: any, statusCode: HttpStatusCode): void => {
        res.status(statusCode);
        res.json(object);
    }

    /**
     * Sends the correct response with status code and the given error message based on the type of error.
     * @param err - The error object.
     * @param res - The Response object to send.
     */
    protected handleError = (err: Error, res: Response): void => {
        console.log(err.message)

        if (err instanceof InvalidArgumentsError)     return this.badRequestResponse(res, { error: err.message });
        if (err instanceof PersistanceError)          return this.internalServerErrorResponse(res, { error: err.message });
        if (err instanceof InvalidCredentialsError)   return this.unauthorizedResponse(res, { error: err.message });
        if (err instanceof RepositoryAccessError)     return this.internalServerErrorResponse(res, { error: err.message });
        if (err instanceof InvalidRequestFormatError) return this.badRequestResponse(res, { error: err.message });
        if (err instanceof AuthenticationError)       return this.internalServerErrorResponse(res, { error: err.message })
        if (err instanceof ResourceNotFoundError)     return this.notFoundResponse(res, { error: err.message });

        this.internalServerErrorResponse(res, UNHANDLED_ERROR_OBJECT);
    }
}