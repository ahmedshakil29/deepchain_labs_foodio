// import { useState } from "react";
// import { createMenuItem } from "@/services/menu.service";

// export function useCreateMenuItem() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const submit = async (data: FormData) => {
//     try {
//       setLoading(true);
//       await createMenuItem(data);
//     } catch (err) {
//       setError("Failed to create menu item");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { submit, loading, error };
// }
