import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createTableIfNotExists } from '../lib';

const httpTrigger: AzureFunction = function(
  context: Context,
  req: HttpRequest
): void {
    const taskId = req.query.taskId || (req.body && req.body.taskId);
    const task = req.query.task || (req.body && req.body.task);

  if (taskId && task) {
    createTableIfNotExists((tableService, tableName) => {
      const entity = {
        PartitionKey: 'Part1',
        RowKey: taskId,
        task
      };
      tableService.replaceEntity(
        tableName,
        entity,
        { echoContent: true },
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
      body: 'Please pass a task and task Id on the query string or in the request body'
    };
    context.done();
  }
};

export default httpTrigger;