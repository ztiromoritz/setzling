import {Router, Request, Response} from 'express'

export class StoreController {
    getRouter(){
        const router = Router();
        router.get('/info/', StoreController.getInfo);
        return router;
    }

    private static getInfo(req:Request, res: Response) {
        res.send("Info info")
    }
}
