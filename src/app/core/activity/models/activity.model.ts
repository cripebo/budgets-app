export interface Activity {
  id?: number;
  action: ActivityAction;
  target_id: number;
  target: ActivityTargetType;
  name: string;
  created_at: string;
}

export enum ActivityAction {
  insert = 'insert',
  update = 'update',
  delete = 'delete',
}

export enum ActivityTargetType {
  budgets = 'budgets',
  clients = 'clients',
  items = 'items',
  settings = 'settings',
  states = 'states',
}
