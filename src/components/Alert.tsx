// AlertComponent.tsx
import Swal from "sweetalert2";

const AlertComponent = {
  success: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Success!",
      text: text || "Operation completed successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  },

  error: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Error!",
      text: text || "Something went wrong.",
      icon: "error",
      confirmButtonText: "OK",
    });
  },

  info: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Information",
      text: text || "Here is some information.",
      icon: "info",
      confirmButtonText: "OK",
    });
  },

  warning: (title?: string, text?: string) => {
    Swal.fire({
      title: title || "Warning!",
      text: text || "Please be careful.",
      icon: "warning",
      confirmButtonText: "OK",
    });
  },
};

export default AlertComponent;
