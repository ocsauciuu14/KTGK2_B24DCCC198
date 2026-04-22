import { Employee } from '@/pages/Employee/data';

const STORAGE_KEY = 'db_employees';

// Helper để lấy dữ liệu từ localStorage
const getLocalData = (): Employee[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initialData: Employee[] = [
      { id: 1, code: 'NV001', name: 'Nguyễn Văn A', position: 'Giám đốc', department: 'Hành chính', salary: 50000000, status: 'CONTRACTED' as any },
      { id: 2, code: 'NV002', name: 'Trần Thị B', position: 'Trưởng phòng', department: 'Kỹ thuật', salary: 30000000, status: 'PROBATION' as any },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
};

// Helper để lưu dữ liệu vào localStorage
const setLocalData = (data: Employee[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

/** Lấy danh sách nhân viên */
export async function queryEmployees() {
  const data = getLocalData();
  return {
    success: true,
    data: data,
  };
}

/** Thêm mới nhân viên */
export async function addEmployee(item: Partial<Employee>) {
  const data = getLocalData();
  const newId = data.length > 0 ? Math.max(...data.map(e => Number(e.id))) + 1 : 1;
  const newCode = `NV${newId.toString().padStart(3, '0')}`;
  
  const newEmployee = {
    ...item,
    id: newId,
    code: newCode,
  } as Employee;
  
  const updatedData = [...data, newEmployee];
  setLocalData(updatedData);
  
  return {
    success: true,
    data: newEmployee,
  };
}

/** Cập nhật nhân viên */
export async function updateEmployee(item: Partial<Employee>) {
  const data = getLocalData();
  const index = data.findIndex(e => e.id === item.id);
  
  if (index > -1) {
    data[index] = { ...data[index], ...item };
    setLocalData(data);
    return {
      success: true,
      data: data[index],
    };
  }
  
  return { success: false, message: 'Không tìm thấy nhân viên' };
}

/** Xóa nhân viên */
export async function removeEmployee(id: string | number) {
  const data = getLocalData();
  const updatedData = data.filter(e => e.id !== id);
  setLocalData(updatedData);
  
  return {
    success: true,
  };
}