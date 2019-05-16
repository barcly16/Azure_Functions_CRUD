import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createTableIfNotExists } from '../lib';
const shortid = require('shortid');

const httpTrigger: AzureFunction = function(
  context: Context,
  req: HttpRequest
): void {
  const taskId = req.query.taskId || (req.body && req.body.taskId);
  const task = req.query.task || (req.body && req.body.task);

  if (task) {
    createTableIfNotExists((tableService, tableName) => {
      const entity = {
        PartitionKey: 'Part1',
        RowKey: taskId || shortid.generate(),
        task
      };
      tableService.insertOrReplaceEntity(
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
      body: 'Please pass a task on the query string or in the request body'
    };
    context.done();
  }
};

export default httpTrigger;
