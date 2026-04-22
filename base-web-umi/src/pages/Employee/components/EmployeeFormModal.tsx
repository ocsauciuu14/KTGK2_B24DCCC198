import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Select, InputNumber } from 'antd';
import { Employee, EmployeeStatus } from '../data';

interface EmployeeFormModalProps {
  visible: boolean;
  editingEmployee: Employee | null;
  onCancel: () => void;
  onSave: (values: any) => void;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ 
  visible, 
  editingEmployee, 
  onCancel, 
  onSave 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (editingEmployee) {
        form.setFieldsValue(editingEmployee);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingEmployee, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  return (
    <Modal
      title={editingEmployee ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên' },
                { max: 50, message: 'Họ tên không quá 50 ký tự' },
                { 
                  pattern: /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/, 
                  message: 'Họ tên không được chứa ký tự đặc biệt' 
                }
              ]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="position" label="Chức vụ" rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}>
              <Select placeholder="Chọn chức vụ">
                <Select.Option value="Giám đốc">Giám đốc</Select.Option>
                <Select.Option value="Trưởng phòng">Trưởng phòng</Select.Option>
                <Select.Option value="Nhân viên">Nhân viên</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department" label="Phòng ban" rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}>
              <Select placeholder="Chọn phòng ban">
                <Select.Option value="Hành chính">Hành chính</Select.Option>
                <Select.Option value="Kỹ thuật">Kỹ thuật</Select.Option>
                <Select.Option value="Kinh doanh">Kinh doanh</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="salary" label="Lương" rules={[{ required: true, message: 'Vui lòng nhập lương' }]}>
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
              <Select placeholder="Chọn trạng thái">
                <Select.Option value={EmployeeStatus.PROBATION}>Thử việc</Select.Option>
                <Select.Option value={EmployeeStatus.CONTRACTED}>Chính thức</Select.Option>
                <Select.Option value={EmployeeStatus.LEAVE}>Nghỉ phép</Select.Option>
                <Select.Option value={EmployeeStatus.TERMINATED}>Đã thôi việc</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeFormModal;
