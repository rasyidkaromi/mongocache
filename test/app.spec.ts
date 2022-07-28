import { app } from '../src/app';
import request from 'supertest';
import { CacheData } from '../src/database';

import { databaseConnection, databaseClose, databaseClear } from '../src/database';

const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

describe('Aplication Rest Api Test', () => {

  beforeAll(async () => await databaseConnection());
  afterEach(async () => await databaseClear());
  afterAll(async () => await databaseClose());

  const wrongKeysTest = 'd5d98991-d7cf-4e32-8da8-035040ada001'
  let deleteSingleCountStatus = { deletedResult: 1 };
  let deleteTotalCountStatus = { deletedResult: 3 };



  beforeEach(async () => {
    const sampleData = [
      {
        orderID: 'd5d98991-d7cf-4e32-8da8-035040ada000',
        data: { DataOrder: 'Order_d5d98991-d7cf-4e32-8da8-035040ada000' },
      },
      {
        orderID: 'd3b0ee47-18e4-4b8f-b650-af3e1218af0f',
        data: { DataOrder: 'Order_d3b0ee47-18e4-4b8f-b650-af3e1218af0f' },
      },
      {
        orderID: '4cbc2847-7bbf-4237-b4f1-86924da8a869',
        data: { DataOrder: 'Order_4cbc2847-7bbf-4237-b4f1-86924da8a869' },
      },
    ];
    await CacheData.insertMany(sampleData);
  });

  describe('GET HTTP methods Test', () => {

    it('GET "/" | should recieved Servers Ready from getHome method', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual('Servers Ready');
    });

    it('GET "/order" | should recieved all orderID with string array of orderID', async () => {
      const res = await request(app).get('/order');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(["d5d98991-d7cf-4e32-8da8-035040ada000", "d3b0ee47-18e4-4b8f-b650-af3e1218af0f", "4cbc2847-7bbf-4237-b4f1-86924da8a869"]);
    });

    it('GET "/order/:orderID" | should result orderID from d5d98991-d7cf-4e32-8da8-035040ada000 is equal "d5d98991-d7cf-4e32-8da8-035040ada000"', async () => {
      const res = await request(app).get('/order/d5d98991-d7cf-4e32-8da8-035040ada000');

      expect(res.status).toBe(200);
      expect(res.body.orderID).toEqual('d5d98991-d7cf-4e32-8da8-035040ada000');
    });

    it('GET "/order/:orderID" | should result data "DataOrder" from orderID d5d98991-d7cf-4e32-8da8-035040ada000 is equal "Order_d5d98991-d7cf-4e32-8da8-035040ada000"', async () => {
      const res = await request(app).get('/order/d5d98991-d7cf-4e32-8da8-035040ada000');

      expect(res.status).toBe(200);
      expect(res.body.data.DataOrder).toEqual("Order_d5d98991-d7cf-4e32-8da8-035040ada000");
    });

    it('GET "/order/:orderID" | should recieved log "Cache hit" from d5d98991-d7cf-4e32-8da8-035040ada000 orderID', async () => {
      consoleSpy.mockClear()
      const res = await request(app).get('/order/d5d98991-d7cf-4e32-8da8-035040ada000');
      expect(console.log).toHaveBeenLastCalledWith('Cache hit')
      expect(res.status).toBe(200);

    });

    it('GET "/order/:orderID" | should recieved log "Cache miss" from wrong orderID', async () => {
      consoleSpy.mockClear()
      const res = await request(app).get('/order/' + wrongKeysTest);
      expect(console.log).toHaveBeenLastCalledWith('Cache miss')
      expect(res.status).toBe(200);

    });

  })

  describe('POST HTTP methods Test', () => {

    it('POST "/order" | should result data with objectContaining { deletedResult: 1 } after delete one orderID', async () => {
      const res = await request(app).post('/order').send({
        orderID: "d5d98991-d7cf-4e32-8da8-035040ada000",
      });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(deleteSingleCountStatus));
    });

    it('POST "/order" | should recieved log 2 from total length database after delete one orderID', async () => {
      consoleSpy.mockClear()
      const res = await request(app).post('/order').send({
        orderID: "d5d98991-d7cf-4e32-8da8-035040ada000",
      });
      expect(console.log).toHaveBeenLastCalledWith(2)
      expect(res.status).toBe(200);
    });

  })

  describe('PUT HTTP methods Test', () => {
    it('PUT "/order/:orderID" | should result data with equal orderID and DataOrder', async () => {
      const res = await request(app).put('/order/d5d98991-d7cf-4e32-8da8-035040ada000').send({
        DataOrder: "New_Order_d5d98991-d7cf-4e32-8da8-035040ada000",
      });
      expect(res.status).toBe(200);
      expect(res.body.orderID).toEqual('d5d98991-d7cf-4e32-8da8-035040ada000');
      expect(res.body.data.DataOrder).toEqual("New_Order_d5d98991-d7cf-4e32-8da8-035040ada000");
    });
  })

  describe('DELETE HTTP methods Test', () => {

    it('DELETE "/order" | should result data with objectContaining { deletedResult: 3 } after delete all of 3 orderID ', async () => {
      const res = await request(app).delete('/order');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining(deleteTotalCountStatus));
    });

    it('DELETE "/order" | should recieved log 0 from total length database after delete all key', async () => {
      consoleSpy.mockClear()
      const res = await request(app).delete('/order');
      expect(console.log).toHaveBeenLastCalledWith(0)
      expect(res.status).toBe(200);
    });
  })

});
