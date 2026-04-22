import React, { useEffect, useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Popconfirm, 
  Row, 
  Col, 
  Card, 
  List, 
  Grid,
  Tag,
  Typography
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { Employee, EmployeeStatus } from './data';
import FilterSection from './components/FilterSection';
import EmployeeFormModal from './components/EmployeeFormModal';

const { useBreakpoint } = Grid;
const { Text } = Typography;

const EmployeePage: React.FC = () => {
  const { list, loading, fetchEmployees, handleAdd, handleUpdate, handleRemove } = useModel('employee');
  
  const screens = useBreakpoint();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchParams, setSearchParams] = useState<any>({});

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredList = useMemo(() => {
    return list.filter(item => {
      const matchSearch = !searchParams.keyword || 
        item.name.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.code.toLowerCase().includes(searchParams.keyword.toLowerCase());
      
      const matchPosition = !searchParams.position || item.position === searchParams.position;
      const matchDepartment = !searchParams.department || item.department === searchParams.department;
      
      return matchSearch && matchPosition && matchDepartment;
    }).sort((a, b) => b.salary - a.salary);
  }, [list, searchParams]);

  const showModal = (employee?: Employee) => {
    setEditingEmployee(employee || null);
    setIsModalVisible(true);
  };

  const handleSave = async (values: any) => {
    let success = false;
    if (editingEmployee) {
      success = await handleUpdate({ ...values, id: editingEmployee.id });
    } else {
      success = await handleAdd(values);
    }
    if (success) setIsModalVisible(false);
  };

  const renderStatusTag = (status: EmployeeStatus) => {
    const statusMap = {
      [EmployeeStatus.PROBATION]: { color: 'blue', text: 'Thử việc' },
      [EmployeeStatus.CONTRACTED]: { color: 'green', text: 'Chính thức' },
      [EmployeeStatus.LEAVE]: { color: 'orange', text: 'Nghỉ phép' },
      [EmployeeStatus.TERMINATED]: { color: 'red', text: 'Đã thôi việc' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    { title: 'Mã NV', dataIndex: 'code', key: 'code' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { 
      title: 'Lương', 
      dataIndex: 'salary', 
      key: 'salary',
      render: (val: number) => val.toLocaleString('vi-VN') + ' đ',
      sorter: (a: Employee, b: Employee) => a.salary - b.salary,
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: EmployeeStatus) => renderStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleRemove(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Quản lý nhân viên',
        extra: [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Thêm nhân viên
          </Button>,
        ],
      }}
    >
      <FilterSection onFilterChange={setSearchParams} />

      {screens.md ? (
        <Table 
          columns={columns} 
          dataSource={filteredList} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <List
          loading={loading}
          dataSource={filteredList}
          renderItem={(item) => (
            <Card style={{ marginBottom: 12 }} size="small">
              <Row justify="space-between">
                <Col span={18}>
                  <Text strong>{item.name}</Text> ({item.code})
                  <div>{item.position} - {item.department}</div>
                  <div>Lương: {item.salary.toLocaleString('vi-VN')} đ</div>
                  <div style={{ marginTop: 4 }}>{renderStatusTag(item.status)}</div>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Space direction="vertical">
                    <Button size="small" icon={<EditOutlined />} onClick={() => showModal(item)}>Sửa</Button>
                    <Popconfirm title="Xóa?" onConfirm={() => handleRemove(item)}>
                      <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}
        />
      )}

      <EmployeeFormModal 
        visible={isModalVisible}
        editingEmployee={editingEmployee}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
      />
    </PageContainer>
  );
};

export default EmployeePage;