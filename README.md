## Mongo-Cache 

<div>
  <br>
</div>

```
1. install depedencies npm install or yarn
2. if error after install, please re-install 'npm i typescript@latest ts-node@latest --save-dev'
3. set .evn
4. npm start or npx nodemon src/app.ts
5. npm run test
```

------------------------------------------------------------
------------------------------------------------------------

<div>
  <br>
</div>

## Rest-Api
```
- Get all orderID | Route: `/order` | Method: `GET`
- Response: [
    "d5d98991-d7cf-4e32-8da8-035040ada000", 
    "d3b0ee47-18e4-4b8f-b650-af3e1218af0f", 
    "4cbc2847-7bbf-4237-b4f1-86924da8a869"
]
```

```
- Get single orderID data | Route: `/order/:orderID` | Method: `GET`
- Response: {
    "_id": "606c968569a73d64845a72..",
    "orderId": "4cbc2847-7bbf-4237-b4f1-86924da8a869",
    "data": { "DataOrder": "order_4cbc2847-7bbf-4237-b4f1-86924da8a869" },
    "date": "2022-.....Z",
    "__v": 0,
}
```

```
- Delete all orderID data | Route: `/order` | Method: `DELETE`
- Response: { "deletedResult": 3 }
```

```
- Delete single orderID data | Route: `/order` | Method: `POST`
- Body : { orderID : "d5d98991-d7cf-4e32-8da8-035040ada000" }
- Response: { "deletedResult": 1 }
```

```
- Update / set single orderID data | Route: `/order/:orderID` | Method: `PUT`
- Route : `/order/d5d98991-d7cf-4e32-8da8-035040ada000`
- Body : { DataOrder: 'New_Order_d5d98991-d7cf-4e32-8da8-035040ada000' }
- Response: {
    "_id": "606c968569a73d64845a72..",
    "orderId": "4cbc2847-7bbf-4237-b4f1-86924da8a869",
    "data": { "DataOrder": "New_Order_4cbc2847-7bbf-4237-b4f1-86924da8a869" },
    "date": "2022-.....Z",
    "__v": 0,
}
```

```
- TTL 60 second
```

------------------------------
------------------------------
<div>
  <br>
</div>

## Test-Api
<div>
  <br>
</div>
  <div align="center" >
<img  src="https://i.ibb.co/pLxnx37/testscreenshot.jpg"  width="900px"  />
</div>


