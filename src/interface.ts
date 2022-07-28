// import { ICacheData } from './database';
import mongoose, { Document, Model, model, Schema } from 'mongoose';
import { DeletedData } from './type'


/**
 * Interface to model the CacheData Schema for TypeScript.
 * @param orderID: string
 * @param data: object
 */

interface ICacheData extends Document {
    orderID: string;
    data: object;
}

interface CacheDataAttrs {
    orderID: string;
    data: object;
}
interface IAttributeKey extends Document {
    orderID: string;
}

interface CacheDataModel extends Model<ICacheData> {
    build(attrs: CacheDataAttrs): ICacheData;
}

export {
    ICacheData,
    CacheDataAttrs,
    CacheDataModel,
    IAttributeKey,
}