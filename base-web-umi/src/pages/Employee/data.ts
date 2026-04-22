export enum EmployeeStatus {
  PROBATION = 'PROBATION',
  CONTRACTED = 'CONTRACTED',
  LEAVE = 'LEAVE',
  TERMINATED = 'TERMINATED',
}

export interface Employee {
  id: string | number;
  code: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
}
