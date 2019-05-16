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
        RowKey: taskId,
      };
      tableService.retrieveEntity(
        tableName,
        entity.PartitionKey,
        entity.RowKey,
        // { echoContent: true },
        (error, result, response) => {
          if (!error) {
            context.res = {
              body: {result, response}
            };
            context.done();
          }
        }
      );
    });
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a task Id on the query string or in the request body'
    };
    context.done();
  }
};

export default httpTrigger;