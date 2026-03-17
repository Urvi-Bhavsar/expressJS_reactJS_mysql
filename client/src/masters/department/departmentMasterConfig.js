import { Button, Space } from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export const departmentMasterColumns = ({
  editingRow,
  handleCancel,
  editDepartmentDetail,
  deleteDepartmentDetail,
}) => {
  return [
    {
      title: "Department Name",
      dataIndex: "name",
      sorter: true,
      onCell: (record) => ({
        type: "text",
        dataIndex: "name",
        editing: editingRow === record.departmentId,
      }),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: true,
      onCell: (record) => ({
        type: "textarea",
        dataIndex: "description",
        editing: editingRow === record.departmentId,
      }),
    },
    {
      title: "Actions",
      render: (_, record) =>
        editingRow === record.departmentId ? (
          <Space>
            <Button icon={<SaveOutlined />} htmlType="submit" />
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleCancel()}
            />
          </Space>
        ) : (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => editDepartmentDetail(record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteDepartmentDetail(record)}
            />
          </Space>
        ),
    },
  ];
};
