import { Document, Model, model, Schema, Types, ConnectionOptions, connect, connection } from 'mongoose';

import { ICacheData, CacheDataAttrs, CacheDataModel, IAttributeKey } from './interface';

const cacheDataSchema = new Schema<IAttributeKey>({
    orderID: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
    date: { type: Date, default: Date.now, index: { expires: '1m' } },
});

cacheDataSchema.statics.build = (attrs: CacheDataAttrs) => {
    return new CacheData(attrs);
};

const CacheData = model<ICacheData, CacheDataModel>(
    'CacheData',
    cacheDataSchema,
);

const databaseConnection = async () => {
    try {
        const mongoURI: string = `mongodb://localhost:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;
        const options: ConnectionOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        };
        await connect(mongoURI, options);
        console.log('MongoDB Connected...');
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
}

const databaseClose = async () => {
    await connection.dropDatabase();
    await connection.close();
};

/**
 * Remove all the data for all db collections.
 */
const databaseClear = async () => {
    const collections = connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

export {
    CacheData,
    databaseConnection,
    databaseClose,
    databaseClear
};