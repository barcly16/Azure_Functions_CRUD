import { createTableService } from 'azure-storage';
export const createTableIfNotExists = (cb) => {
  const tableService = createTableService();
  const TABLE_NAME: string = 'todos';
  tableService.createTableIfNotExists(TABLE_NAME, error => {
    if (!error) {
      cb(tableService, TABLE_NAME);
    }
  });
};
