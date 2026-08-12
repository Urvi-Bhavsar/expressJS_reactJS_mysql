import Axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const useAddEmployee = ({ state, employeeDetailsRef }) => {
  const navigate = useNavigate();

  const [editID, setEditID] = useState(state?.ele?.employeeId || null);

  // Update editID when state changes
  useEffect(() => {
    if (state?.ele?.employeeId) {
      setEditID(state.ele.employeeId);
    }
  }, [state]);

  const handleFormSubmit = (values) => {
    const url = !!editID
      ? `http://localhost:3001/update-employee-details/${editID}`
      : "http://localhost:3001/create";

    const method = !!editID ? "put" : "post";
    
    Axios({ method, url, data: values })
      .then((res) => {
        toast.success(res.data.message);
        
        // Reset form and editID
        if (employeeDetailsRef?.current) {
          employeeDetailsRef.current.resetForm();
        }
        setEditID(null);
        
        // Navigate back to list page
        if (navigate) {
          navigate("/");
        }
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      });
  };

  return {
    editID,
    handleFormSubmit,
  };
};

export { useAddEmployee };
