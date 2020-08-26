import { Router } from "express";

const whitelist = [
  'http://localhost:4200',
  'http://localhost:4201',
  'http://localhost:4202',
  'http://localhost:4203',
  'https://blousevn.herokuapp.com',
  'https://blouse-admin.herokuapp.com',
  'https://blouse-api.herokuapp.com/'
];
export const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}