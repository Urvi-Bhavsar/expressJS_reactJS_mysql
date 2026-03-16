import axios from "axios";
import { debounce } from "lodash";
import { useCallback } from "react";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useDesignationMaster = ({ }) => {

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
  const [departmentOptions, setDepartmentOptions] = useState(null);

  const getDesignationDetails = (
    page = currentPage,
    size = pageSize,
    field = sortField,
    order = sortOrder,
    searchParams = search
  ) => {
    setIsLoading(true);
    axios.get(
      `http://localhost:3001/designation/list/?page=${page}&pageSize=${size}&sortField=${field}&sortOrder=${order}&search=${searchParams}`
    )
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        setCurrentPage(res.data.currentPage || 1);
        setPageSize(res.data.pageSize);
        setTotalEntries(res.data.totalEntries);
        setData(res.data.data);
      })
      .catch((err) => { });
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
    setIsLoading(true);
    axios.delete(
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
      .catch((err) => { });
  };

  const handleTableChange = (_pagination, _filters, sorter) => {
    const { field, order } = sorter;
    const ordering = getOrdering(order);
    setSortField(field);
    setSortOrder(ordering);
    getDesignationDetails(currentPage, pageSize, field, ordering);
  };

  const handleDropdownOpen = (open) => {
    if (open) {
      axios.get("http://localhost:3001/departments")
        .then((res) => {
          console.log("fetched departments:", res.data);
          setDepartmentOptions(res.data);
        })
        .catch((err) => {
          console.error("failed to load departments", err);
          toast.error("Could not load departments");
        });
    }
  };

  const handleSave = (values) => {
    const url = !!values.isNew
      ? "http://localhost:3001/designation/create"
      : `http://localhost:3001/designation/update/${values.designationId}`;
    const method = !!values.isNew ? "post" : "put";
    axios({
      method,
      url,
      data: { ...values, department: values?.department?.value },
    })
      .then((res) => {
        toast.success(res.data.message);
        getDesignationDetails();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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

  return {
    designationRef,
    isLoading,
    totalEntries,
    departmentOptions,
    data,
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
  }
}