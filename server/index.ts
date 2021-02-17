

import express from 'express';
import { Application } from "express";
import {  getTableData, insertMockToElastic } from './services/elastic';
import { Routes } from '../shared/routes.types';



const app: Application = express();


app.route(Routes.GET_TABLE_DATA).get(getTableData);

// app.route('/api/courses/:id').get(getCourseById);

// app.route('/api/lessons').get(searchLessons);

insertMockToElastic()

const httpServer: any = app.listen(3000, () => {
  console.log("HTTP REST API Server running at http://localhost:" + httpServer.address().port);
});



