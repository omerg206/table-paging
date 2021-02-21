

import 'reflect-metadata';
import express from 'express';
import { Application } from "express";
import { insertMockToElastic } from './services/elastic';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import fs from 'fs';
import path from 'path';
import cors from 'cors'
import { HelloResolver } from './resolvers/table-data-resolver';

// use it before all route definitions

const main = async () => {
  const app: Application = express();
  app.set("trust proxy", 1)

// app.use(cors({ origin: ['http://127.0.0.1:4200', 'http://localhost:4200'] }));

// app.route(Routes.GET_TABLE_DATA).get(getTableData);

// app.route('/api/courses/:id').get(getCourseById);

// app.route('/api/lessons').get(searchLessons);

insertMockToElastic();


const apolloServer = new ApolloServer({
  schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
  }),
  // context: ({ req, res }: MyContext) => ({
  //     req, res, redis: redisClient,
  //     userLoader: createUserLoader(), updootLoader: createUpdootLoader()
  // })
});

apolloServer.applyMiddleware({ app, cors: false })

const httpServer: any = app.listen(3000, () => {
  console.log("HTTP REST API Server running at http://localhost:" + httpServer.address().port);
});



// function readFiles(dirname: any) {
//   let res: TableData[] = [];
//   let id = 1;
//   fs.readdir(dirname, function (err, filenames) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     filenames.forEach(function (filename) {
//       fs.readFile(path.join(dirname, filename), 'utf-8', function (err, content) {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         const data = JSON.parse(content);
//         const changedData = data.map((ele: TableData) => { ele.id = id; ++id; return ele });
//         res = res.concat(changedData);
//         if (res.length > 10000) {
//           const writeData =  JSON.stringify(res);
//           require('fs').writeFile( './my.json',writeData,  (err: any) => {
//                 if (err) {
//                     console.error('Crap happens');
//                 }
//             }
//         );
//         }

//       });
//     });



//   });
// }



// readFiles(path.join(__dirname, './assets/mock-data'))

}

main().catch(err => console.log(err)) ;
