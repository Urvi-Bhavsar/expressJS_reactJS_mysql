import { Button, Space } from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

export const designationMasterColumns = ({
  editingRow,
  departmentOptions,
  handleDropdownOpen,
  handleDropdownChange,
  handleCancel,
  editDesignationDetail,
  deleteDesignationDetail,
}) => {
  return [
    {
      title: "Designation Name",
      dataIndex: "name",
      sorter: true,
      onCell: (record) => ({
        type: "text",
        dataIndex: "name",
        editing: editingRow === record.designationId,
      }),
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      onCell: (record) => ({
        type: "select",
        dataIndex: "department",
        editing: editingRow === record.designationId,
        options: departmentOptions,
        handleDropdownOpen,
        handleDropdownChange,
      }),
      render: (value) => value?.label,
    },
    {
      title: "Reporting Manager",
      dataIndex: "reportingManager",
      sorter: true,
      onCell: (record) => ({
        type: "text",
        dataIndex: "reportingManager",
        editing: editingRow === record.designationId,
      }),
    },
    {
      title: "Job Description",
      dataIndex: "jobDescription",
      sorter: true,
      onCell: (record) => ({
        type: "textarea",
        dataIndex: "jobDescription",
        editing: editingRow === record.designationId,
      }),
    },
    {
      title: "Actions",
      render: (_, record) =>
        editingRow === record.designationId ? (
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
              onClick={() => editDesignationDetail(record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteDesignationDetail(record)}
            />
          </Space>
        ),
    },
  ];
};
