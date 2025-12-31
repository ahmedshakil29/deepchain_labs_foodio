"use client";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-[600px] text-center bg-[#F8F8F8] p-8 rounded-lg shadow-sm">
        <h1 className="text-[28px] font-semibold text-[#1A1A1A] mb-4">
          My Profile
        </h1>
        <p className="text-[16px] text-[#666666] mb-6">
          Profile page is under construction. 🚧
        </p>
        <p className="text-[14px] text-[#999999]">
          The feature will be available soon. Please check back later.
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getAuthToken } from "@/utils/auth";

// type UserProfile = {
//   id: string;
//   name: string;
//   email: string;
//   address: string;
// };

// export default function ProfilePage() {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     address: "",
//   });
//   const [message, setMessage] = useState("");

//   // Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = getAuthToken();
//         if (!token) return;

//         const response = await axios.get("http://localhost:3001/user/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setProfile(response.data);
//         setFormData({
//           name: response.data.name,
//           email: response.data.email,
//           address: response.data.address,
//         });
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = getAuthToken();
//       if (!token) return;

//       const response = await axios.patch(
//         "http://localhost:3001/user/profile",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setProfile(response.data);
//       setMessage("Profile updated successfully!");
//       setEditing(false);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       setMessage("Failed to update profile.");
//     }
//   };

//   if (loading) return <p className="p-6 text-center">Loading profile...</p>;

//   if (!profile)
//     return <p className="p-6 text-center">No profile data found.</p>;

//   return (
//     <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-[600px] mx-auto bg-[#F8F8F8] p-8 rounded-lg shadow-sm">
//         <h1 className="text-[28px] font-semibold text-[#1A1A1A] mb-4">
//           My Profile
//         </h1>

//         {message && <p className="mb-4 text-green-600">{message}</p>}

//         {!editing ? (
//           <div className="space-y-4">
//             <p>
//               <span className="font-semibold">Name:</span> {profile.name}
//             </p>
//             <p>
//               <span className="font-semibold">Email:</span> {profile.email}
//             </p>
//             <p>
//               <span className="font-semibold">Address:</span> {profile.address}
//             </p>

//             <button
//               className="mt-4 px-6 py-2 bg-[#1A3C34] text-white rounded-lg hover:bg-[#2A4C44] transition-colors"
//               onClick={() => setEditing(true)}
//             >
//               Edit Profile
//             </button>
//           </div>
//         ) : (
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Address
//               </label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
//                 rows={3}
//                 required
//               />
//             </div>
//             <div className="flex gap-3">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-[#1A3C34] text-white rounded-lg hover:bg-[#2A4C44] transition-colors"
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//                 onClick={() => setEditing(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
