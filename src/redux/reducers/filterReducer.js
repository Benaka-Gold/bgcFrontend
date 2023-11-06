const initialState = [];

const FilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_LEADS":
      return state;
    case "FOLLOW_UPS":
      let filteredFollowUp = action.payload.filter(
        (lead) => lead.status === "Follow up"
      );
      return filteredFollowUp;
    case "NEW":
      let filteredNew = action.payload.filter((lead) => lead.status === "New");
      return filteredNew;
    case "INVALID":
      let filteredInvalid = action.payload.filter(
        (lead) => lead.status === "Invalid"
      );
      return filteredInvalid;

    default:
      return state;
  }
};

export default FilterReducer;
