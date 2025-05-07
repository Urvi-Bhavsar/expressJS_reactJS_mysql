// import endpoints from "../../../../api/endpoints";

export const cityMasterColumns = [
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    width: 140,
    editable: true,
    sorter: true,
    valueDisplay: "dropdown",
    // endpoint: endpoints.master.dropdown.countryDropdown,
    placeholder: "Select...",
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
    width: 140,
    editable: true,
    sorter: true,
    valueDisplay: "dropdown",
    // endpoint: endpoints.master.dropdown.state,
    placeholder: "Select...",
  },
  {
    title: "City",
    dataIndex: "name",
    key: "name",
    width: 140,
    editable: true,
    sorter: true,
    valueDisplay: "text",
    sorter: true,
  },
];
