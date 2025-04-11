'use strict';

import dayjs from 'dayjs'
import sqlsite from 'sqlite3'

import express from 'express'
import morgan from 'morgan'

const app = express()
app.use(morgan())

const db = new sqlsite.Database('db_poke.sqlite', (err) => {
    if (err) throw err;
});

    function getAllSizes() {
        return new Promise((resolve, reject) => {
          const sql = `SELECT * FROM sizes`;
          db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      }

      function getElementsByType(type) {
        return new Promise((resolve, reject) => {
          const sql = `SELECT * FROM elements WHERE type = ?`;
          db.all(sql, [type], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      }

      function getAllElements() {
        return new Promise((resolve, reject) => {
          const sql = `SELECT * FROM elements`;
          db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      }

      function createPoke(sizeID, elementIDs) {
        return new Promise((resolve, reject) => {
          const insertHeader = `INSERT INTO pokeHeaders (sizeID) VALUES (?)`;
          db.run(insertHeader, [sizeID], function (err) {
            if (err) reject(err);
      
            const pokeID = this.lastID;
            const insertComp = `INSERT INTO pokeComposition (pokeID, elementID) VALUES (?, ?)`;
      
            const promises = elementIDs.map(eid => {
              return new Promise((res, rej) => {
                db.run(insertComp, [pokeID, eid], (err) => {
                  if (err) rej(err);
                  else res();
                });
              });
            });
      
            Promise.all(promises)
              .then(() => resolve(pokeID))
              .catch(reject);
          });
        });
      }

      function createOrder(userID, pokes, totalPrice) {
        return new Promise((resolve, reject) => {
          const insertOrder = `
            INSERT INTO orderHeaders (date, userID, orderPrice)
            VALUES (CURRENT_DATE, ?, 0)
          `;
          db.run(insertOrder, [userID, totalPrice], function (err) {
            if (err) reject(err);
      
            const orderID = this.lastID;
            const insertLine = `
              INSERT INTO orderLines (orderID, pokeID, quantity)
              VALUES (?, ?, 1)
            `;
      
            const promises = pokes.map(poke =>
              new Promise((res, rej) => {
                db.run(insertLine, [orderID, poke.pokeID, poke.quantity], (err) => {
                  if (err) rej(err);
                  else res();
                });
              })
            );
      
            Promise.all(promises)
              .then(() => resolve(orderID))
              .catch(reject);
          });
        });
      }
      

      function getUserOrders(userID) {
        return new Promise((resolve, reject) => {
          const sql = `
            SELECT oh.id AS orderID, oh.date, oh.orderPrice, SUM(ol.quantity) AS totalBowls
            FROM orderHeaders oh
            JOIN orderLines ol ON oh.id = ol.orderID
            WHERE oh.userID = ?
            GROUP BY oh.id
          `;
          db.all(sql, [userID], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      }

      function getOrderDetails(orderID) {
        return new Promise((resolve, reject) => {
          const sql = `
            SELECT ol.quantity, ph.sizeID, el.element, el.type
            FROM orderLines ol
            JOIN pokeHeaders ph ON ol.pokeID = ph.id
            JOIN pokeComposition pc ON ph.id = pc.pokeID
            JOIN elements el ON pc.elementID = el.id
            WHERE ol.orderID = ?
          `;
      
          db.all(sql, [orderID], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      }
      
      

      export {
        getAllSizes,
        getElementsByType,
        getAllElements,
        createPoke,
        createOrder,
        getUserOrders,
        getOrderDetails
      };
      