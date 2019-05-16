import { AzureFunction, Context, HttpRequest } from '@azure/functions';
const shortid = require('shortid');
import DataService from '../lib/dataService';

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const task = req.query.task || (req.body && req.body.task);
  const dataService = new DataService('todos');
  if (task) {
    const entity = {
      PartitionKey: 'Part1',
      RowKey: shortid.generate(),
      task
    };
    const res = await dataService.insertEntity(entity, { echoContent: true });
    context.res = {
      body: res
    };
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a task on the query string or in the request body'
    };
  }
};

export default httpTrigger;
