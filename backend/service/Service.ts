import {Response} from "express";
import {InvalidArgumentsError} from "../errors/InvalidArgumentsError";
import {PersistanceError} from "../errors/PersistanceError";

export abstract class Service {
    okResponse(res: Response, message: string): void {
        res.status(200).json({ message });
    }

    createdResponse(res: Response, message: string): void {
        res.status(201).json({message});
    }

    noContentResponse(res: Response): void {
        res.status(204).send();
    }

    badRequestResponse(res: Response, message: string): void {
        res.status(400).json({ message });
    }

    unauthorizedResponse(res: Response, message: string): void {
        res.status(401).json({ message });
    }

    notFoundResponse(res: Response, message: string): void {
        res.status(404).json({ message });
    }

    internalServerErrorResponse(res: Response, message: string): void {
        res.status(500).json({ message });
    }

    handleError(error: Error, res: Response): void {
        if (error instanceof InvalidArgumentsError) return this.badRequestResponse(res, error.message);
        if (error instanceof PersistanceError) return this.internalServerErrorResponse(res, error.message);
    }
}