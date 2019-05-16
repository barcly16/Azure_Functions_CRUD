import { createTableService, services, ServiceResponse } from 'azure-storage';
const shortid = require('shortid');

const task = req.query.task || (req.body && req.body.task);
  const tableService = createTableService();
  const TABLE_NAME: string = 'todos';

  tableService.createTableIfNotExists(TABLE_NAME, error => {
    if (!error) {
      const entity = {
        PartitionKey: 'Part1',
        RowKey: shortid.generate(),
        task
      };
      tableService.insertEntity(
        TABLE_NAME,
        entity,
        { echoContent: true },
        function(error, result, response) {
          if (!error) {
            // result contains the ETag for the new entity
            context.res = {
              // status: 200, /* Defaults to 200 */
              body: { result, response }
            };
            context.done();
          }
        }
      );
    }
  });


  const createTableIfNotExists = (tableName: string): Promise<any> => new Promise((resolve, reject) => {
    tableService.createTableIfNotExists(tableName, (error, result, response) => {
      if(error) {
        reject(error)
      } else {
        resolve({result, response})
      }
    })
  })