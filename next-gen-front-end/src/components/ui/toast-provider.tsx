import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1c1917",
          color: "#fafaf9",
          border: "1px solid #292524",
          borderRadius: "12px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#1c1917",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1c1917",
          },
        },
      }}
    />
  );
}
