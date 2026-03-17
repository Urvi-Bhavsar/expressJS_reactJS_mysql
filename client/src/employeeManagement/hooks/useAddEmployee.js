import Axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const useAddEmployee = ({ state, employeeDetailsRef }) => {
  const navigate = useNavigate();

  const [editID, setEditID] = useState(state?.ele?.employeeId);
  const [designationDropdownData, setDesignationDropdownData] = useState([]);
  const [departmentDropdownData, setDepartmentDropdownData] = useState([]);
  const [skillsDropdownData, setSkillsDropdownData] = useState([]);
  const [countryDropdownData, setCountryDropdownData] = useState([]);
  const [stateDropdownData, setStateDropdownData] = useState([]);
  const [cityDropdownData, setCityDropdownData] = useState([]);

  const handleFormSubmit = (values) => {
    const url = !!editID
      ? `http://localhost:3001/update-employee-details/${editID}`
      : "http://localhost:3001/employee/create";

    const method = !!editID ? "put" : "post";
    Axios({ method, url, data: values })
      .then((res) => {
        toast.success(res.data.message);
        !!editID && setEditID("");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    !!editID && handleRetriveData();
  }, [editID]);

  const handleRetriveData = () => {
    Axios.patch(`http://localhost:3001/retrive-employee-details/${editID}`)
      .then((res) => {
        toast.success(res?.data?.message);
        employeeDetailsRef.current?.setValues({
          ...employeeDetailsRef.current?.values,
          name: res.data?.data?.name,
          email: res.data?.data?.email,
          position: res.data?.data?.position,
          age: res.data?.data?.age,
          officeDays: res.data?.data?.officeDays,
          employeeId: res.data?.data?.employeeId,
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const fetchDropdownOptions = async (key, values) => {
    let response;
    switch (key) {
      case "department":
        response = await Axios.get("http://localhost:3001/departments");
        setDepartmentDropdownData(response.data.data);
        break;
      case "designation":
        response = await Axios.get("http://localhost:3001/designations");
        setDesignationDropdownData(response.data.data);
        break;
      case "skills":
        response = await Axios.get("http://localhost:3001/skills");
        setSkillsDropdownData(response.data.data);
        break;
      case "country":
        response = await Axios.get("http://localhost:3001/countries");
        setCountryDropdownData(response.data.data);
        break;
      case "state":
        response = await Axios.get(
          `http://localhost:3001/states/?countryID=${values.country.value}`
        );
        setStateDropdownData(response.data.data);
        break;
      case "city":
        response = await Axios.get(
          `http://localhost:3001/cities/?stateID=${values.state.value}`
        );
        setCityDropdownData(response.data.data);
        break;
      default:
        break;
    }
  };

  return {
    editID,
    departmentDropdownData,
    designationDropdownData,
    skillsDropdownData,
    countryDropdownData,
    stateDropdownData,
    cityDropdownData,
    handleFormSubmit,
    fetchDropdownOptions,
  };
};

export { useAddEmployee };
