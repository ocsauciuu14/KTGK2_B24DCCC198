import { useState, useCallback } from 'react';
import { message } from 'antd';
import { 
  queryEmployees, 
  addEmployee, 
  updateEmployee, 
  removeEmployee 
} from '@/services/employee';
import { Employee, EmployeeStatus } from '@/pages/Employee/data';

export default function useEmployeeModel() {
  const [list, setList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch dữ liệu
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await queryEmployees();
      if (res.success) {
        setList(res.data);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  }, []);

  // Thêm nhân viên
  const handleAdd = async (data: Partial<Employee>) => {
    try {
      const res = await addEmployee(data);
      if (res.success) {
        message.success('Thêm nhân viên thành công');
        await fetchEmployees(); // Re-fetch
        return true;
      }
    } catch (error) {
      message.error('Thêm nhân viên thất bại');
    }
    return false;
  };

  // Cập nhật nhân viên
  const handleUpdate = async (data: Partial<Employee>) => {
    try {
      const res = await updateEmployee(data);
      if (res.success) {
        message.success('Cập nhật nhân viên thành công');
        await fetchEmployees(); // Re-fetch
        return true;
      }
    } catch (error) {
      message.error('Cập nhật nhân viên thất bại');
    }
    return false;
  };

  // Xóa nhân viên với nghiệp vụ đặc biệt
  const handleRemove = async (employee: Employee) => {
    // Nghiệp vụ: Chỉ cho phép xóa nếu status là 'PROBATION' hoặc 'TERMINATED'
    if (employee.status !== EmployeeStatus.PROBATION && employee.status !== EmployeeStatus.TERMINATED) {
      message.error('Chỉ được phép xóa nhân viên có trạng thái Thử việc hoặc Đã thôi việc');
      return false;
    }

    try {
      const res = await removeEmployee(employee.id);
      if (res.success) {
        message.success('Xóa nhân viên thành công');
        await fetchEmployees(); // Re-fetch
        return true;
      }
    } catch (error) {
      message.error('Xóa nhân viên thất bại');
    }
    return false;
  };

  return {
    list,
    loading,
    fetchEmployees,
    handleAdd,
    handleUpdate,
    handleRemove,
  };
}