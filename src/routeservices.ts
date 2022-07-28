import { Application, Router, NextFunction, Request, Response } from 'express';
import { databaseConnection, CacheData } from './database';
import { ICacheData } from './interface';
import { DeletedData } from './type'


class RouteServices {
    public router: Router = Router();
    private keysPath = '/order/';
    private homePath = '/';

    constructor() { }

    routes = () => {
        this.router.get(this.homePath, this.getHome)

        this.router.get(this.keysPath, this.getAllKeys)
        this.router.get(this.keysPath + ':orderID', this.getSingleKeys)

        this.router.delete(this.keysPath, this.deleteAllKeys)

        this.router.post(this.keysPath, this.deleteSingleKeys)
        this.router.put(this.keysPath + `:orderID`, this.setSingleKeys)

        return this.router;
    }
    private getHome = async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).send({ data: 'Servers Ready' });
        } catch (e) {
            next(e);
        }
    }
    private getAllKeys = async (req: Request, res: Response, next: NextFunction) => {
        // this.serviceCache.getAllKeys(req, res, next)
        try {
            const data = await CacheData.find();
            const orderIDs: string[] = data.map((d) => d.orderID)
            res.status(200).send(orderIDs);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
    private getSingleKeys = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderID } = req.params;
            let data: ICacheData | null = await CacheData.findOne({ orderID });

            console.log(data ? 'Cache hit' : 'Cache miss');

            if (!data) {
                const localKeys = this.uuidv4()
                const dataModel = new CacheData({
                    orderID: localKeys,
                    data: { DataOrder: 'Order_' + localKeys },
                });

                await this.limitCounter();
                data = await dataModel.save();

                res.status(200).send(data);
            } else {
                res.status(200).send(data);
            }
        } catch (e) {
            next(e);
        }
    }
    private deleteAllKeys = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resData = await CacheData.deleteMany({});
            const lastData = await CacheData.find();
            console.log(lastData.length)
            let data: DeletedData = { deletedResult: resData.deletedCount!! | 0 };
            res.status(200).send(data);
        } catch (e) {
            next(e);
        }
    }
    private deleteSingleKeys = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderID } = req.body;
            const resData = await CacheData.deleteOne({ orderID });
            const lastData = await CacheData.find();
            console.log(lastData.length)
            let data: DeletedData = { deletedResult: resData.deletedCount!! | 0 };
            res.status(200).send(data);
        } catch (e) {
            next(e);
        }
    }
    private setSingleKeys = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderID } = req.params;
            let data = req.body

            let dataObj = await CacheData.findOne({ orderID });

            if (!dataObj) {
                const dataModel = new CacheData({
                    orderID,
                    data,
                });

                await this.limitCounter();
                let resData = await dataModel.save();
                res.status(200).send(resData);
            } else {
                dataObj.data = data;
                let resData = await dataObj.save();
                res.status(200).send(resData);
            }
        } catch (e) {
            next(e);
        }
    }
    private limitCounter = async () => {
        const count = await CacheData.countDocuments();
        const limit = +process.env.CACHE_LIMIT!!;
        if (count >= limit) {
            const oldest = await CacheData.find({}).sort({ date: -1 });
            await CacheData.deleteOne({ orderID: oldest[0].orderID });
        }
    }
    private uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

const routes = async (app: Application) => {
    const newRoute = new RouteServices().routes()
    app.use('/', newRoute);
    await databaseConnection();
};

export {
    routes,
    RouteServices
}
