import React, { useRef } from "react";
import "../../App.css";
import { ToastContainer } from "react-toastify";
import { useAddEmployee } from "../hooks/useAddEmployee";
import { Formik } from "formik";
import { employeeDetailsSchema } from "../schema/employeeDetailsSchema";
import { Card, Button, Row, Col, DatePicker, Radio, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { RedoOutlined, CheckOutlined, LeftOutlined } from "@ant-design/icons";
import moment from "moment";

const AddEmployeeDetailsForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const employeeDetailsRef = useRef();
  const {
    editID,
    designationDropdownData,
    skillsDropdownData,
    countryDropdownData,
    stateDropdownData,
    cityDropdownData,
    handleFormSubmit,
    fetchDesignations,
  } = useAddEmployee({
    state,
    employeeDetailsRef,
  });
  return (
    <Formik
      initialValues={{
        employeeId: "",
        name: "",
        email: "",
        position: "",
        age: "",
        officeDays: "",
        mobile_no: "",
        date_of_birth: null,
        gender: "",
        designation: null,
        skills: [],
        country: null,
        state: null,
        city: null,
      }}
      validationSchema={employeeDetailsSchema}
      innerRef={employeeDetailsRef}
      onSubmit={(values) => {
        handleFormSubmit(values);
      }}
    >
      {(formik) => {
        const {
          errors,
          touched,
          values,
          setFieldTouched,
          setFieldValue,
          handleSubmit,
          resetForm,
        } = formik;
        return (
          <>
            <Card
              title="Employee Details Form"
              style={{
                width: "100%",
                maxWidth: "1700px",
                marginTop: "30px",
              }}
            >
              <form
                onSubmit={(e) => {
                  handleSubmit();
                  e.preventDefault();
                }}
              >
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Employee ID:</label>
                      <input
                        type="text"
                        value={values.employeeId}
                        disabled={true}
                        className="form-input"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={values.name}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("name");
                          setFieldValue("name", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>{touched.name && errors.name ? errors.name : ""}</b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Age:</label>
                      <input
                        type="number"
                        value={values.age}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("age");
                          setFieldValue("age", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>{touched.age && errors.age ? errors.age : ""}</b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Position:</label>
                      <input
                        type="text"
                        value={values.position}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("position");
                          setFieldValue("position", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.position && errors.position
                            ? errors.position
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="text"
                        value={values.email}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("email");
                          setFieldValue("email", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.email && errors.email ? errors.email : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Office Days:</label>
                      <input
                        type="number"
                        value={values.officeDays}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("officeDays");
                          setFieldValue("officeDays", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.officeDays && errors.officeDays
                            ? errors.officeDays
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Mobile No:</label>
                      <input
                        type="number"
                        value={values.mobile_no}
                        disabled={state?.isView}
                        onChange={(e) => {
                          setFieldTouched("mobile_no");
                          setFieldValue("mobile_no", e.target.value);
                        }}
                        className="form-input"
                      />
                      <div className="error-message">
                        <b>
                          {touched.mobile_no && errors.mobile_no
                            ? errors.mobile_no
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={5} md={5} lg={5}>
                    <div className="form-group">
                      <label>Date Of Birth:</label>
                      <DatePicker
                        value={values.date_of_birth}
                        disabled={state?.isView}
                        className="datepicker"
                        allowClear
                        disabledDate={(currentdate) =>
                          currentdate > moment().endOf("days") ||
                          currentdate > moment(new Date(), "YYYY-MM-DD")
                        }
                        format="DD-MM-YYYY"
                        size="middle"
                        onChange={(e) => {
                          setFieldTouched("date_of_birth");
                          setFieldValue("date_of_birth", e);
                        }}
                      />
                      <div className="error-message">
                        <b>
                          {touched.date_of_birth && errors.date_of_birth
                            ? errors.date_of_birth
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Gender:</label>
                      <Radio.Group
                        className="datepicker"
                        onChange={(e) => {
                          setFieldTouched("gender");
                          setFieldValue("gender", e?.target?.value);
                        }}
                        value={values.gender}
                        disabled={state?.isView}
                      >
                        <Radio value={1}>Male</Radio>
                        <Radio value={2}>Female</Radio>
                        <Radio value={3}>Other</Radio>
                      </Radio.Group>
                      <div className="error-message">
                        <b>
                          {touched.gender && errors.gender ? errors.gender : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Designation:</label>
                      <Select
                        defaultOpen={false}
                        className="datepicker"
                        disabled={state?.isView}
                        onChange={(selected) => {
                          setFieldTouched("designation");
                          setFieldValue(
                            "designation",
                            !!selected
                              ? {
                                  value: selected?.value,
                                  label: selected?.label,
                                }
                              : null
                          );
                        }}
                        value={values.designation}
                        options={designationDropdownData.map((designation) => ({
                          label: designation.name,
                          value: designation.id,
                        }))}
                        labelInValue
                        allowClear
                        size="large"
                        style={{ width: "100%" }}
                        onDropdownVisibleChange={() => {
                          fetchDesignations("designation", values);
                        }}
                      ></Select>
                      <div className="error-message">
                        <b>
                          {touched.designation && errors.designation
                            ? errors.designation
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Skills:</label>
                      <Select
                        defaultOpen={false}
                        disabled={state?.isView}
                        className="datepicker"
                        onChange={(selected) => {
                          if (!selected || selected?.length === 0) {
                            setFieldValue("skills", []);
                            return;
                          }
                          setFieldTouched("skills");
                          setFieldValue(
                            "skills",
                            selected?.map(({ value, label }) => ({
                              value,
                              label,
                            }))
                          );
                        }}
                        mode="multiple"
                        allowClear
                        value={values.skills}
                        options={skillsDropdownData.map((skills) => ({
                          label: skills.name,
                          value: skills.id,
                        }))}
                        labelInValue
                        size="large"
                        style={{ width: "100%" }}
                        onDropdownVisibleChange={() => {
                          fetchDesignations("skills", values);
                        }}
                      ></Select>
                      <div className="error-message">
                        <b>
                          {touched.skills && errors.skills ? errors.skills : ""}
                        </b>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>Country:</label>
                      <Select
                        defaultOpen={false}
                        disabled={state?.isView}
                        className="datepicker"
                        onChange={(selected) => {
                          setFieldTouched("country");
                          setFieldValue(
                            "country",
                            !!selected
                              ? {
                                  value: selected?.value,
                                  label: selected?.label,
                                }
                              : null
                          ).then(() => {
                            if (values?.country?.value != selected?.value) {
                              setFieldValue("city", null);
                              setFieldValue("state", null);
                            }
                          });
                        }}
                        value={values.country}
                        options={countryDropdownData.map((country) => ({
                          label: country.name,
                          value: country.id,
                        }))}
                        labelInValue
                        allowClear
                        size="large"
                        style={{ width: "100%" }}
                        onDropdownVisibleChange={() => {
                          fetchDesignations("country", values);
                        }}
                      ></Select>
                      <div className="error-message">
                        <b>
                          {touched.country && errors.country
                            ? errors.country
                            : ""}
                        </b>
                      </div>
                    </div>
                  </Col>{" "}
                  <Col xs={12} sm={12} md={12} lg={6}>
                    {console.log("!values?.country", values?.country)}
                    <div className="form-group">
                      <label>State:</label>
                      <Select
                        defaultOpen={false}
                        disabled={state?.isView || !values?.country}
                        className="datepicker"
                        onChange={(selected) => {
                          setFieldTouched("state");
                          setFieldValue(
                            "state",
                            !!selected
                              ? {
                                  value: selected?.value,
                                  label: selected?.label,
                                }
                              : null
                          ).then(() => {
                            if (values?.state?.value != selected?.value) {
                              setFieldValue("city", null);
                            }
                          });
                        }}
                        value={values.state}
                        options={stateDropdownData.map((state) => ({
                          label: state.name,
                          value: state.id,
                        }))}
                        labelInValue
                        allowClear
                        size="large"
                        style={{ width: "100%" }}
                        onDropdownVisibleChange={() => {
                          fetchDesignations("state", values);
                        }}
                      ></Select>
                      <div className="error-message">
                        <b>
                          {touched.state && errors.state ? errors.state : ""}
                        </b>
                      </div>
                    </div>
                  </Col>{" "}
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="form-group">
                      <label>City:</label>
                      <Select
                        defaultOpen={false}
                        disabled={
                          state?.isView || !(values?.country && values?.state)
                        }
                        className="datepicker"
                        onChange={(selected) => {
                          setFieldTouched("city");
                          setFieldValue(
                            "city",
                            !!selected
                              ? {
                                  value: selected?.value,
                                  label: selected?.label,
                                }
                              : null
                          );
                        }}
                        value={values.city}
                        options={cityDropdownData.map((city) => ({
                          label: city.name,
                          value: city.id,
                        }))}
                        labelInValue
                        allowClear
                        size="large"
                        style={{ width: "100%" }}
                        onDropdownVisibleChange={() => {
                          fetchDesignations("city", values);
                        }}
                      ></Select>
                      <div className="error-message">
                        <b>{touched.city && errors.city ? errors.city : ""}</b>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    icon={<RedoOutlined />}
                    size="large"
                    onClick={() => resetForm()}
                    disabled={state?.isView}
                  >
                    Reset
                  </Button>
                  <Button
                    htmlType="submit"
                    icon={<CheckOutlined />}
                    size="large"
                    style={{ marginLeft: "10px" }}
                    disabled={state?.isView}
                  >
                    {!editID ? "Save" : "Update"}
                  </Button>
                  <Button
                    icon={<LeftOutlined />}
                    size="large"
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                </Row>
              </form>
            </Card>
            <ToastContainer />
          </>
        );
      }}
    </Formik>
  );
};

export default AddEmployeeDetailsForm;
