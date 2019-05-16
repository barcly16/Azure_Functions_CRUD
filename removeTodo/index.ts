import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createTableIfNotExists } from '../lib';

const httpTrigger: AzureFunction = function(
  context: Context,
  req: HttpRequest
): void {
  const taskId = req.query.taskId || (req.body && req.body.taskId);

  if (taskId) {
    createTableIfNotExists((tableService, tableName) => {
      const entity = {
        PartitionKey: 'Part1',
        RowKey: taskId
      };
      tableService.deleteEntity(tableName, entity, null, (error, response) => {
        if (!error) {
          context.res = {
            body: response
          };
          context.done();
        }
      });
    });
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a task ID on the query string or in the request body'
    };
    context.done();
  }
};

export default httpTrigger;
