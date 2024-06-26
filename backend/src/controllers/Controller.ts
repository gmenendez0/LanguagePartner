// noinspection t

import {Request, Response} from "express";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {PersistanceError} from "../errors/PersistanceError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {RepositoryAccessError} from "../errors/RepositoryAccessError";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";
import {AuthenticationError} from "../errors/AuthenticationError";
import {HttpStatusCode} from "axios";
import {ResourceNotFoundError} from "../errors/ResourceNotFoundError";
import {ClassConstructor, plainToInstance} from "class-transformer";
import {DTO} from "../DTOs/DTO";
import {InvalidResourceStateError} from "../errors/InvalidResourceStateError";
import {ExternalInterfaceError} from "../errors/ExternalInterfaceError";

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
     * @function conflictResponse
     * @description Sends a conflict response with a 409 status code.
     *
     * @template T
     * @param {Response} res - The response object used to send the result.
     * @param {T} object - The object to be sent in the response body.
     *
     * @returns {void}
     */
    protected conflictResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HttpStatusCode.Conflict);
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
        if (err instanceof InvalidResourceStateError) return this.conflictResponse(res, { error: err.message });
        if (err instanceof ExternalInterfaceError)    return this.internalServerErrorResponse(res, { error: "Internal server error." });

        this.internalServerErrorResponse(res, UNHANDLED_ERROR_OBJECT);
    }

    /**
     * Converts the request body to the provided DTO class.
     * @param req - The Request object containing the body to convert.
     * @param DTOClass - The class to convert the body to.
     * @throws {InvalidRequestFormatError} If the body cannot be converted to the provided DTO class.
     */
    protected convertBodyToDTO = <T extends DTO>(req: Request, DTOClass: ClassConstructor<T>): T => {
        try {
            return plainToInstance(DTOClass, req.body);
        } catch (error) {
            throw new InvalidRequestFormatError(error.message);
        }
    }
}