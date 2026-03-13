import { useEffect } from "react";
import { Table, Button, Pagination, Row, Col, Input, } from "antd";
import { PlusOutlined, SearchOutlined, } from "@ant-design/icons";
import { Formik, Form } from "formik";
import validationSchema from "./schema";
import { ToastContainer } from "react-toastify";
import { designationMasterColumns } from "./designationMasterConfig";
import { EditableCell } from "../../common/editableCell";
import { useDesignationMaster } from "./useDesignationmaster";

const DesignationEditableTable = () => {
  const {
    designationRef,
    isLoading,
    totalEntries,
    departmentOptions,
    data = [],
    currentPage,
    pageSize,
    editingRow,
    getDesignationDetails,
    handleAddRow,
    handlePageChange,
    deleteDesignationDetail,
    handleTableChange,
    handleDropdownOpen,
    handleSave,
    editDesignationDetail,
    onChangeSearch,
    handleCancel,
    handleDropdownChange
  } = useDesignationMaster({});
  console.log("daaata", data);

  useEffect(() => {
    getDesignationDetails();
  }, []);

  return (
    <>
      <Formik
        initialValues={
          data?.find((item) => item?.designationId === editingRow) || {
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
                <Input
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
              columns={designationMasterColumns({
                editingRow,
                departmentOptions,
                handleDropdownOpen,
                handleDropdownChange,
                handleCancel,
                editDesignationDetail,
                deleteDesignationDetail,
              })}
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
