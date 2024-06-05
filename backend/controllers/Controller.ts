import {Response} from "express";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {PersistanceError} from "../errors/PersistanceError";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";
import {RepositoryAccessError} from "../errors/RepositoryAccessError";
import {InvalidRequestFormatError} from "../errors/InvalidRequestFormatError";

export abstract class Controller {
    okResponse(res: Response, message: string): void {
        res.status(HTTPResponseCode.OK).json({ message }).send();
    }

    createdResponse(res: Response, message: string): void {
        res.status(HTTPResponseCode.CREATED).json({message}).send();
    }

    noContentResponse(res: Response): void {
        res.status(HTTPResponseCode.NO_CONTENT).send();
    }

    badRequestResponse(res: Response, message: string): void {
        res.status(HTTPResponseCode.BAD_REQUEST).json({ message }).send();
    }

    unauthorizedResponse(res: Response, message: string): void {
        res.status(HTTPResponseCode.UNAUTHORIZED).json({ message }).send();
    }

    notFoundResponse(res: Response, message: string): void {
        res.status(HTTPResponseCode.NOT_FOUND).json({ message }).send();
    }

    internalServerErrorResponse(res: Response, message: string): void {
        res.status(HTTPResponseCode.INTERNAL_SERVER_ERROR).json({ message }).send();
    }

    handleError(error: Error, res: Response): void {
        if (error instanceof InvalidArgumentsError)     return this.badRequestResponse(res, error.message);
        if (error instanceof PersistanceError)          return this.internalServerErrorResponse(res, error.message);
        if (error instanceof InvalidCredentialsError)   return this.unauthorizedResponse(res, error.message);
        if (error instanceof RepositoryAccessError)     return this.internalServerErrorResponse(res, error.message);
        if (error instanceof InvalidRequestFormatError) return this.badRequestResponse(res, error.message);

        return this.internalServerErrorResponse(res, error.message);
    }
}