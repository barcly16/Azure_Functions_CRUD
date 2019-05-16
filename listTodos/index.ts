import { AzureFunction, Context } from '@azure/functions';
import { TableQuery } from 'azure-storage';
import DataService from '../lib/dataService';

const httpTrigger: AzureFunction = async function(context: Context): Promise<void> {
  const dataService = new DataService('todos')
  const query = new TableQuery().top(5).where('PartitionKey eq ?', 'Part1');

  const res = await dataService.listEntities(query)
  context.res = {
    body: res
  };
};

export default httpTrigger;
