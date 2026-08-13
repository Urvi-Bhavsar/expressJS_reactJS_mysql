import Axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const useEmployeeDetailsList = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalEntries, setTotalEntries] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");

  const fileInputRef = useRef(null);

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

  const getEmployeeDetails = useCallback(
    (
      page = currentPage,
      size = pageSize,
      field = sortField,
      order = sortOrder,
      searchParams = search
    ) => {
      setIsLoading(true);
      Axios.get(
        `${process.env.REACT_APP_API_URL}/get-employee-details/?page=${page}&pageSize=${size}&sortField=${field}&sortOrder=${order}&search=${searchParams}`
      )
        .then((res) => {
          setIsLoading(false);
          toast.success(res.data.message);
          setCurrentPage(res.data.currentPage);
          setPageSize(res.data.pageSize);
          setTotalEntries(res.data.totalEntries);
          setEmployeeDetails(res.data.data);
        })
        .catch((err) => {
          setIsLoading(false);
          const errorMessage =
            err.response?.data?.message || "Failed to fetch employee details";
          toast.error(errorMessage);
        });
    },
    [currentPage, pageSize, sortField, sortOrder, search]
  );

  // Run once on mount. getEmployeeDetails is intentionally omitted since it's
  // recreated whenever its own state deps change, and this effect should only
  // fire on initial load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getEmployeeDetails();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a ref to the latest getEmployeeDetails so the debounced function
  // (created once) never calls a stale closure.
  const getEmployeeDetailsRef = useRef(getEmployeeDetails);
  useEffect(() => {
    getEmployeeDetailsRef.current = getEmployeeDetails;
  }, [getEmployeeDetails]);

  const onChangeSearch = useMemo(
    () =>
      debounce((e) => {
        const searchValue = e?.target?.value?.trim();
        setSearch(searchValue);
        getEmployeeDetailsRef.current(
          currentPage,
          pageSize,
          sortField,
          sortOrder,
          searchValue
        );
      }, 500),
    [currentPage, pageSize, sortField, sortOrder]
  );

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleTableChange = (_pagination, _filters, sorter) => {
    const { field, order } = sorter;
    const ordering = getOrdering(order);
    setSortField(field);
    setSortOrder(ordering);
    getEmployeeDetails(currentPage, pageSize, field, ordering);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    getEmployeeDetails(page, size, sortField, sortOrder);
  };

  const handleDownload = () => {
    Axios.get(`${process.env.REACT_APP_API_URL}/download-employee-data`, {
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employees.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Employee data downloaded successfully");
      })
      .catch(async (err) => {
        if (err.response && err.response.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const errorData = JSON.parse(text);
            toast.error(
              errorData.message || errorData.error || "Failed to download employee data"
            );
          } catch (parseError) {
            toast.error("Failed to download employee data");
          }
        } else {
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to download employee data";
          toast.error(errorMessage);
        }
      });
  };

  const handleDownloadSample = () => {
    Axios.get(`${process.env.REACT_APP_API_URL}/download-sample-template`, {
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Employee_Upload_Template.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success(
          "Sample template downloaded successfully! Check the Instructions sheet for detailed guide."
        );
      })
      .catch(async (err) => {
        if (err.response && err.response.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const errorData = JSON.parse(text);
            toast.error(
              errorData.message || errorData.error || "Failed to download sample template"
            );
          } catch (parseError) {
            toast.error("Failed to download sample template");
          }
        } else {
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to download sample template";
          toast.error(errorMessage);
        }
      });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/upload-employee-details`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      e.target.value = null;
      setUploading(false);
      getEmployeeDetails();
      toast.success(response.data.message);
    } catch (error) {
      setUploading(false);
      toast.error(error.response?.data?.error);
    }
  };

  const deleteEmployeeDetail = (id) => {
    setIsLoading(true);
    Axios.delete(`${process.env.REACT_APP_API_URL}/delete-employee-details/${id}`)
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);

        const newPage =
          employeeDetails.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;

        getEmployeeDetails(newPage, pageSize, sortField, sortOrder);
      })
      .catch((err) => {
        setIsLoading(false);
        const errorMessage = err.response?.data?.message || "Failed to delete employee";
        toast.error(errorMessage);
      });
  };

  return {
    employeeDetails,
    isLoading,
    uploading,
    totalEntries,
    currentPage,
    pageSize,
    fileInputRef,
    handlePageChange,
    handleTableChange,
    deleteEmployeeDetail,
    handleUpload,
    handleDownload,
    handleDownloadSample,
    handleButtonClick,
    onChangeSearch,
  };
};

export { useEmployeeDetailsList };