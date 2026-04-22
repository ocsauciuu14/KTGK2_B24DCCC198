import React from 'react';
import { Card, Form, Row, Col, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface FilterSectionProps {
  onFilterChange: (values: any) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [form] = Form.useForm();

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form 
        form={form} 
        layout="vertical" 
        onValuesChange={() => onFilterChange(form.getFieldsValue())}
      >
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="keyword" label="Tìm kiếm">
              <Input placeholder="Mã hoặc Tên nhân viên" prefix={<SearchOutlined />} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="position" label="Chức vụ">
              <Select placeholder="Chọn chức vụ" allowClear>
                <Select.Option value="Giám đốc">Giám đốc</Select.Option>
                <Select.Option value="Trưởng phòng">Trưởng phòng</Select.Option>
                <Select.Option value="Nhân viên">Nhân viên</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="department" label="Phòng ban">
              <Select placeholder="Chọn phòng ban" allowClear>
                <Select.Option value="Hành chính">Hành chính</Select.Option>
                <Select.Option value="Kỹ thuật">Kỹ thuật</Select.Option>
                <Select.Option value="Kinh doanh">Kinh doanh</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FilterSection;
