import { AzureFunction, Context } from '@azure/functions';
import { TableQuery } from 'azure-storage';
import { createTableIfNotExists } from '../lib';

const httpTrigger: AzureFunction = function(context: Context): void {
  createTableIfNotExists((tableService, tableName) => {
    const query = new TableQuery().top(5).where('PartitionKey eq ?', 'Part1');

    tableService.queryEntities(
      tableName,
      query,
      null,
      (error, result, response) => {
        if (!error) {
          context.res = {
            body: response
          };
          context.done();
        }
      }
    );
  });
};

export default httpTrigger;
