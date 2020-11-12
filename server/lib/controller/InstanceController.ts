import {Router, Request, Response} from 'express';
import { InstanceService } from "../service/InstanceService";


export class InstanceController {
    private service: InstanceService;

    constructor(service: InstanceService){
        this.service = service;
    }


    getRouter(){
        const router = Router();
        router.get('/instances/', this.getInstances.bind(this))
        router.post('/instances/', this.notImplemented.bind(this))
        router.get('/instances/:id', this.notImplemented.bind(this))
        router.get('/instances/:id/info/', this.notImplemented.bind(this))
        return router;
    }

    private notImplemented(req: Request, res: Response){
        res.send(501)
    }

    private getInstances(req: Request, res: Response) {

    }
}