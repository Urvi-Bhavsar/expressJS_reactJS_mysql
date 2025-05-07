import { Table } from "antd";
import Column from "antd/es/table/Column";
import { useState } from "react";

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

const handleTableChange = (_pagination, _filters, sorter) => {
  const { field, order } = sorter;
  const ordering = getOrdering(order);
  //   setSortField(field);
  //   setSortOrder(ordering);
  //   getEmployeeDetails(currentPage, pageSize, field, ordering);
};
// const [currentPage, setCurrentPage] = useState(1);
// const [pageSize, setPageSize] = useState(5);
// const [totalEntries, setTotalEntries] = useState("");
// const [sortField, setSortField] = useState("");
// const [sortOrder, setSortOrder] = useState("");
// const [search, setSearch] = useState("");
const cityMaster = () => {
  const [sss, setSSS] = useState;
  return (
    <Table
      id="form"
      bordered
      //   dataSource={dataSource ? dataSource : rowData}
      //   pagination={!isPagination ? tableDataPagination : false}
      scroll={{ x: "max-content" }}
      components={{
        body: {
          //   cell: EditableCell,
        },
      }}
      rowClassName="editable-row"
      rowKey="id"
      rowSelection={{
        type: "Checkbox",
        // ...rowSelection,
      }}
      //   loading={isLoading}
      onChange={handleTableChange}
    >
      <Column
        id="sr_no"
        title="Sr. No."
        // fixed="left"
        width={80}
        className="sr_no"
        // render={(_, __, index) => (currentPage - 1) * pageSize + index + 1}
      />
      {/* {handler(mergedColumns)}
      {!isStatus ? (
        <Column
          id="status"
          title="Status"
          key="is_active"
          inputType="switch"
          dataIndex="is_active"
          width={80}
          editable
          sorter={{
            // eslint-disable-next-line no-unsafe-optional-chaining
            compare: (a, b) => a?.dataIndex - b?.dataIndex,
          }}
          render={(_, record) => (
            <>
              <Space size="middle">
                <Switch
                  id="switch"
                  disabled={
                    editingKey !== false ||
                    isSwitchDisabled ||
                    (isDisabledStatus && record?.is_active == false) ||
                    (isDisabledStatusWithPrimary &&
                      record?.is_primary == true) ||
                    (disableStatusOnKey &&
                      disableStatusOnValue &&
                      record?.[disableStatusOnKey] === disableStatusOnValue)
                  }
                  checked={record?.is_active}
                  onClick={(e) =>
                    handleInActive(confirmationPopupTitle, record)
                  }
                  size="small"
                />
              </Space>
            </>
          )}
        />
      ) : (
        ""
      )}
      {!action ? (
        <Column
          id="action"
          title="Action"
          key="action"
          width={100}
          fixed="right"
          render={(_, record) => {
            const editable = isEditing(record);

            return (
              <Space size="middle">
                {editable ? (
                  <>
                    <Tooltip title="Close">
                      <Typography.Link
                        id="close"
                        onClick={() => cancelEditable(record)}
                      >
                        <CloseCircleOutlined />
                      </Typography.Link>
                    </Tooltip>

                    {record?.id ? (
                      <Tooltip title="Update">
                        <Typography.Link
                          id="update"
                          disabled={actionDisable || isFileUploading}
                          onClick={record?.id ? update : save}
                        >
                          <CheckOutlined />
                        </Typography.Link>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Save">
                        <Typography.Link
                          id="save"
                          disabled={actionDisable || isFileUploading}
                          onClick={record?.id ? update : save}
                        >
                          <SaveOutlined />
                        </Typography.Link>
                      </Tooltip>
                    )}
                  </>
                ) : !isEditIcon ? (
                  <>
                    <Tooltip title="Edit">
                      <Typography.Link
                        id="edit"
                        disabled={
                          actionDisable ||
                          isEditDisabled ||
                          editingKey !== false ||
                          (selectionType !== "radio" &&
                            selectedRowKeys?.length > 0) ||
                          isEditHide ||
                          (isDisabledStatus && record?.is_active == false) ||
                          (isDisabledStatusWithPrimary &&
                            record?.is_primary == true)
                        }
                        onClick={() => handleEdit(record, columns)}
                      >
                        <EditOutlined />
                      </Typography.Link>
                    </Tooltip>
                  </>
                ) : (
                  <LineOutlined />
                )}
              </Space>
            );
          }}
        />
      ) : (
        ""
      )} */}
    </Table>
  );
};
export default cityMaster;
