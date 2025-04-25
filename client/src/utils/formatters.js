// client/src/utils/formatters.js
export const capitalize = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const formatRequestStatus = (status) => {
  if (!status) return "";

  const statusMap = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };

  return statusMap[status] || capitalize(status);
};

export const getStatusColor = (status) => {
  if (!status) return "default";

  const colorMap = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "error",
  };

  return colorMap[status] || "default";
};
