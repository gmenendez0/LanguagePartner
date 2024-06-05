import {Response} from "express";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {PersistanceError} from "../errors/PersistanceError";

export abstract class Controller {
    okResponse(res: Response, message: string): void {
        res.status(200).json({ message }).send();
    }

    createdResponse(res: Response, message: string): void {
        res.status(201).json({message}).send();
    }

    noContentResponse(res: Response): void {
        res.status(204).send();
    }

    badRequestResponse(res: Response, message: string): void {
        res.status(400).json({ message }).send();
    }

    unauthorizedResponse(res: Response, message: string): void {
        res.status(401).json({ message }).send();
    }

    notFoundResponse(res: Response, message: string): void {
        res.status(404).json({ message }).send();
    }

    internalServerErrorResponse(res: Response, message: string): void {
        res.status(500).json({ message }).send();
    }

    handleError(error: Error, res: Response): void {
        if (error instanceof InvalidArgumentsError) return this.badRequestResponse(res, error.message);
        if (error instanceof PersistanceError) return this.internalServerErrorResponse(res, error.message);
    }
}