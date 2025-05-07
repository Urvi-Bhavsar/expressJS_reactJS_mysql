import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Select,
  Pagination,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Formik, Form, Field, useFormikContext } from "formik";
import validationSchema from "./schema";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { debounce } from "lodash";

const EditableCell = ({
  editing,
  dataIndex,
  type,
  options,
  children,
  handleDropdownChange,
  ...restProps
}) => {
  const { setFieldValue, validateField, errors, touched } = useFormikContext();

  return (
    <td {...restProps}>
      {editing ? (
        <Field name={dataIndex}>
          {({ field }) => {
            switch (type) {
              case "select":
                return (
                  <>
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      onChange={handleDropdownChange}
                    >
                      {options.map((option) => (
                        <Select.Option
                          label={option.label}
                          value={option.value}
                        >
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                    <span style={{ color: "red" }}>{errors[dataIndex]}</span>
                  </>
                );
              case "textarea":
                return (
                  <>
                    <Input.TextArea {...field} rows={2} />
                    <span style={{ color: "red" }}>{errors[dataIndex]}</span>
                  </>
                );
              case "text":
              default:
                return (
                  <>
                    <Input {...field} />
                    <span style={{ color: "red" }}>{errors[dataIndex]}</span>
                  </>
                );
            }
          }}
        </Field>
      ) : (
        children
      )}
    </td>
  );
};

const DesignationEditableTable = () => {
  const designationRef = useRef();
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalEntries, setTotalEntries] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    getDesignationDetails();
  }, []);

  const getDesignationDetails = (
    page = currentPage,
    size = pageSize,
    field = sortField,
    order = sortOrder,
    searchParams = search
  ) => {
    Axios.get(
      `http://localhost:3001/designation/list/?page=${page}&pageSize=${size}&sortField=${field}&sortOrder=${order}&search=${searchParams}`
    )
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        setCurrentPage(res.data.currentPage);
        setPageSize(res.data.pageSize);
        setTotalEntries(res.data.totalEntries);
        setData(res.data.data);
      })
      .catch((err) => {});
  };
  const handleAddRow = () => {
    if (editingRow !== null) return;
    const newRow = {
      designationId: Math.random(),
      name: "",
      department: null,
      reportingManager: "",
      jobDescription: "",
      isNew: true,
    };
    setData([newRow, ...data]);
    setEditingRow(newRow.designationId);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    getDesignationDetails(page, size, sortField, sortOrder);
  };

  const getOrdering = (order) => {
    switch (order) {
      case "ascend":
        return "ASC";
      case "descend":
        return "DESC";
      default:
        return "";
    }
  };
  const deleteDesignationDetail = (record) => {
    Axios.delete(
      `http://localhost:3001/designation/delete/${record.designationId}`
    )
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        getDesignationDetails(
          data.length == 1 ? currentPage - 1 : currentPage,
          pageSize,
          sortField,
          sortOrder
        );
      })
      .catch((err) => {});
  };
  const handleTableChange = (_pagination, _filters, sorter) => {
    const { field, order } = sorter;
    const ordering = getOrdering(order);
    setSortField(field);
    setSortOrder(ordering);
    getDesignationDetails(currentPage, pageSize, field, ordering);
  };

  const handleSave = (values) => {
    const newData = data.map((item) =>
      item.designationId === editingRow ? { ...item, ...values } : item
    );
    const url = !!values.isNew
      ? "http://localhost:3001/designation/create"
      : `http://localhost:3001/designation/update/${values.designationId}`;
    const method = !!values.isNew ? "post" : "put";
    Axios({
      method,
      url,
      data: { ...values, department: values?.department?.value },
    })
      .then((res) => {
        toast.success(res.data.message);
        getDesignationDetails();
        // !!editID && setEditID("");
        // navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    // setData(newData);
    setEditingRow(null);
  };

  const editDesignationDetail = (record) => {
    setEditingRow(record.designationId);
  };

  const onChangeSearch = useCallback(
    debounce((e) => {
      let searchValue = e?.target?.value?.trim();
      setSearch(searchValue);
      getDesignationDetails(
        currentPage,
        pageSize,
        sortField,
        sortOrder,
        searchValue
      );
    }, 500),
    [1000]
  );

  const handleCancel = () => {
    const row = data.find((item) => item.designationId === editingRow);
    if (row?.isNew) {
      setData((prevData) =>
        prevData.filter((item) => item.designationId !== editingRow)
      );
    }
    setEditingRow(null);
  };

  const handleDropdownChange = (value, e) => {
    designationRef.current?.setFieldValue("department", e);
  };

  const columns = [
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
        options: [
          { value: "1", label: "HR" },
          { value: "2", label: "Engineering" },
          { value: "3", label: "Marketing" },
          { value: "4", label: "Sales" },
        ],
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
  return (
    <>
      <Formik
        initialValues={
          data.find((item) => item.designationId === editingRow) || {
            name: "",
            department: null,
            reportingManager: "",
            jobDescription: "",
          }
        }
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        innerRef={designationRef}
        enableReinitialize
        onSubmit={handleSave}
      >
        {({ handleSubmit, values, errors }) => (
          <Form>
            <Row
              style={{
                width: "100%",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Col style={{ flex: 1, maxWidth: "400px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  allowClear
                  size={"large"}
                  onChange={onChangeSearch}
                  icon={<SearchOutlined />}
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                />
              </Col>
              <Col style={{ display: "flex", gap: "20px" }}>
                <Button
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddRow}
                >
                  Add Row
                </Button>
              </Col>
            </Row>

            <Table
              components={{ body: { cell: EditableCell } }}
              columns={columns}
              dataSource={data}
              rowKey="designationId"
              pagination={false}
              onChange={handleTableChange}
              scroll={{ y: 400 }}
              loading={isLoading}
              bordered
            />
          </Form>
        )}
      </Formik>
      <div className="pagination-wrapper">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalEntries || 0}
          onChange={(page, size) => handlePageChange(page, size)}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default DesignationEditableTable;
