import {Response} from "express";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {PersistanceError} from "../errors/PersistanceError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {RepositoryAccessError} from "../errors/RepositoryAccessError";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";
import {HTTPResponseCode} from "./HTTPResponseCode";

const UNHANDLED_ERROR_OBJECT = { error: "Internal server error." };

export abstract class Controller {
    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with status code 200.
    protected okResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HTTPResponseCode.OK);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with status code 201.
    protected createdResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HTTPResponseCode.CREATED);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with status code 400.
    protected badRequestResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HTTPResponseCode.BAD_REQUEST);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with status code 401.
    protected unauthorizedResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HTTPResponseCode.UNAUTHORIZED);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with status code 404.
    protected notFoundResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HTTPResponseCode.NOT_FOUND);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with status code 500.
    protected internalServerErrorResponse = <T>(res: Response, object: T): void => {
        this.setUpAndSendResponse(res, object, HTTPResponseCode.INTERNAL_SERVER_ERROR);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Sets the object as response body and sends the response with the given status code.
    private setUpAndSendResponse = (res: Response, object: any, statusCode: number): void => {
        this.setResponseBody(res, object);
        this.sendResponseWithStatusCode(res, statusCode);
    }

    //Pre: Must receive an object that can be converted to standard body media type.
    //Post: Converts the object to standard body media type and sets it as response body.
    //Standard body media type: JSON.
    private setResponseBody = <T>(res: Response, object: T): void => {
        res.json(object);
    }

    //Post: Sends the response with the given status code.
    private sendResponseWithStatusCode = (res: Response, statusCode: number): void => {
        res.status(statusCode).send();
    }
    protected handleError = (err: Error, res: Response): void => {
        if (err instanceof InvalidArgumentsError)     return this.badRequestResponse(res, { error: err.message });
        if (err instanceof PersistanceError)          return this.internalServerErrorResponse(res, { error: err.message });
        if (err instanceof InvalidCredentialsError)   return this.unauthorizedResponse(res, { error: err.message });
        if (err instanceof RepositoryAccessError)     return this.internalServerErrorResponse(res, { error: err.message });
        if (err instanceof InvalidRequestFormatError) return this.badRequestResponse(res, { error: err.message });

        this.internalServerErrorResponse(res, UNHANDLED_ERROR_OBJECT);
    }
}