import axios from "axios";
import { debounce } from "lodash";
import { useCallback } from "react";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";

export const useDepartmentmaster = ({ }) => {

  const departmentRef = useRef();
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalEntries, setTotalEntries] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");

  const getDepartmentDetails = (
    page = currentPage,
    size = pageSize,
    field = sortField,
    order = sortOrder,
    searchParams = search
  ) => {
    setIsLoading(true);
    axios.get(
      `http://localhost:3001/departments/list/?page=${page}&pageSize=${size}&sortField=${field}&sortOrder=${order}&search=${searchParams}`
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
      departmentId: Math.random(),
      name: "",
      description: "",
      isNew: true,
    };
    setData([newRow, ...data]);
    setEditingRow(newRow.departmentId);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    getDepartmentDetails(page, size, sortField, sortOrder);
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

  const deleteDepartmentDetail = (record) => {
    setIsLoading(true);
    axios.delete(
      `http://localhost:3001/departments/delete/${record.departmentId}`
    )
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        getDepartmentDetails(
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
    getDepartmentDetails(currentPage, pageSize, field, ordering);
  };

  const handleSave = (values) => {
    const url = !!values.isNew
      ? "http://localhost:3001/departments/create"
      : `http://localhost:3001/departments/update/${values.departmentId}`;
    const method = !!values.isNew ? "post" : "put";
    axios({
      method,
      url,
      data: { ...values },
    })
      .then((res) => {
        toast.success(res.data.message);
        getDepartmentDetails();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    setEditingRow(null);
  };

  const editDepartmentDetail = (record) => {
    setEditingRow(record.departmentId);
  };

  const onChangeSearch = useCallback(
    debounce((e) => {
      let searchValue = e?.target?.value?.trim();
      setSearch(searchValue);
      getDepartmentDetails(
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
    const row = data.find((item) => item.departmentId === editingRow);
    if (row?.isNew) {
      setData((prevData) =>
        prevData.filter((item) => item.departmentId !== editingRow)
      );
    }
    setEditingRow(null);
  };

  return {
    departmentRef,
    isLoading,
    totalEntries,
    data,
    currentPage,
    pageSize,
    editingRow,
    getDepartmentDetails,
    handleAddRow,
    handlePageChange,
    deleteDepartmentDetail,
    handleTableChange,
    handleSave,
    editDepartmentDetail,
    onChangeSearch,
    handleCancel,
  }
}