import { Input, Select } from "antd";
import { Field, useFormikContext } from "formik";

export const EditableCell = ({
  editing,
  dataIndex,
  type,
  options,
  children,
  handleDropdownOpen,
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
                      onDropdownVisibleChange={handleDropdownOpen}
                    >
                      {options?.map((option) => (
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
