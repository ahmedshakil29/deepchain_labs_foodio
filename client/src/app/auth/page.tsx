"use client";
import Button from "@/app/(components)/commons/Button";
import Input from "@/app/(components)/commons/InputTextBox";
import Logo from "@/app/(components)/commons/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";

// Zod Validation Schemas
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInData = z.infer<typeof signInSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
      setApiError("");
    };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      setApiError("");

      // Validate with Zod
      const validatedData = signInSchema.parse({
        email: formData.email,
        password: formData.password,
      });

      // API Call
      const response = await axios.post("http://localhost:3001/admin/login", {
        email: validatedData.email,
        password: validatedData.password,
      });

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Save user info including role
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Role-based redirect
      const userRole = response.data.user.role.toLowerCase();

      if (userRole === "admin") {
        router.push("/admin/MenuItems");
      }

      if (userRole === "user") {
        router.push("/customer/Dashboard");
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const validationErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            validationErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(validationErrors);
      } else if (axios.isAxiosError(error)) {
        // Handle API errors
        setApiError(
          error.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      setApiError("");

      // Validate with Zod
      const validatedData = registerSchema.parse({
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });

      // API Call
      const response = await axios.post(
        "http://localhost:3001/user/createuser",
        {
          name: validatedData.fullName,
          email: validatedData.email,
          address: validatedData.address,
          password: validatedData.password,
        }
      );

      // Show success message
      alert(
        response.data.message || "Account created successfully! Please sign in."
      );

      // Switch to sign in tab
      setActiveTab("signin");

      // Clear form
      setFormData({
        email: validatedData.email, // Keep email for easy sign in
        password: "",
        fullName: "",
        address: "",
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const validationErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            validationErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(validationErrors);
      } else if (axios.isAxiosError(error)) {
        // Handle API errors
        setApiError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="bg-[#F5F5F0] rounded-[24px] p-[48px] w-full max-w-[530px] shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-[16px]">
          <Logo />
        </div>

        {/* Tagline */}
        <p className="text-center text-[#7A7A7A] text-[16px] mb-[32px]">
          Premium flavors, delivered.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-[8px] mb-[32px] bg-white rounded-[56px] p-[4px]">
          <button
            onClick={() => {
              setActiveTab("signin");
              setErrors({});
              setApiError("");
            }}
            className={`flex-1 h-[40px] rounded-[56px] font-medium text-[14px] transition ${
              activeTab === "signin"
                ? "bg-[#F5F5F0] text-[#1A3C34]"
                : "bg-white text-[#7A7A7A]"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setErrors({});
              setApiError("");
            }}
            className={`flex-1 h-[40px] rounded-[56px] font-medium text-[14px] transition ${
              activeTab === "register"
                ? "bg-[#F5F5F0] text-[#1A3C34]"
                : "bg-white text-[#7A7A7A]"
            }`}
          >
            Register
          </button>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === "signin" && (
          <div className="space-y-[24px]">
            <div>
              <label className="block text-[#1A3C34] text-[14px] font-medium mb-[8px]">
                Email
              </label>
              <Input
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                width="w-full"
                height="h-[48px]"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[#1A3C34] text-[14px] font-medium mb-[8px]">
                Password
              </label>
              <Input
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange("password")}
                width="w-full"
                height="h-[48px]"
                type="password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="pt-[8px]">
              <Button
                text={isLoading ? "Signing In..." : "Sign In"}
                onClick={handleSignIn}
                width="w-full"
                height="h-[48px]"
                bgColor="#1A3C34"
                textColor="#FFFFFF"
              />
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div className="space-y-[24px]">
            <div>
              <label className="block text-[#1A3C34] text-[14px] font-medium mb-[8px]">
                Full Name
              </label>
              <Input
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
                width="w-full"
                height="h-[48px]"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-[#1A3C34] text-[14px] font-medium mb-[8px]">
                Email
              </label>
              <Input
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                width="w-full"
                height="h-[48px]"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[#1A3C34] text-[14px] font-medium mb-[8px]">
                Address
              </label>
              <Input
                placeholder="e.g. House-23, Road-23, Jamaica, USA"
                value={formData.address}
                onChange={handleInputChange("address")}
                width="w-full"
                height="h-[48px]"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-[#1A3C34] text-[14px] font-medium mb-[8px]">
                Password
              </label>
              <Input
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange("password")}
                width="w-full"
                height="h-[48px]"
                type="password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="pt-[8px]">
              <Button
                text={isLoading ? "Creating Account..." : "Create Account"}
                onClick={handleRegister}
                width="w-full"
                height="h-[48px]"
                bgColor="#1A3C34"
                textColor="#FFFFFF"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { z } from "zod";

// import Button from "@/components/Button";
// import Input from "@/components/InputTextBox";
// import Logo from "@/components/Logo";
// import { login, register } from "@/services/auth.service";

// /* =========================
//    Zod Validation Schemas
// ========================= */
// const signInSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const registerSchema = z.object({
//   fullName: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   address: z.string().min(5, "Address must be at least 5 characters"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function AuthPage() {
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     fullName: "",
//     address: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   /* =========================
//       Input Change Handler
//   ========================= */
//   const handleInputChange =
//     (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData({ ...formData, [field]: e.target.value });

//       if (errors[field]) {
//         setErrors({ ...errors, [field]: "" });
//       }
//       setApiError("");
//     };

//   /* =========================
//           SIGN IN
//   ========================= */
//   const handleSignIn = async () => {
//     try {
//       setIsLoading(true);
//       setErrors({});
//       setApiError("");

//       const validated = signInSchema.parse({
//         email: formData.email,
//         password: formData.password,
//       });

//       const user = await login(validated.email, validated.password);

//       if (user.role === "ADMIN") {
//         router.push("/admin/MenuItems");
//       }

//       if (user.role === "USER") {
//         router.push("/customer/Dashboard");
//       }
//     } catch (error: any) {
//       if (error instanceof z.ZodError) {
//         const fieldErrors: Record<string, string> = {};
//         error.issues.forEach((err) => {
//           if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
//         });
//         setErrors(fieldErrors);
//       } else {
//         setApiError("Login failed. Please check your credentials.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* =========================
//           REGISTER
//   ========================= */
//   const handleRegister = async () => {
//     try {
//       setIsLoading(true);
//       setErrors({});
//       setApiError("");

//       const validated = registerSchema.parse({
//         fullName: formData.fullName,
//         email: formData.email,
//         address: formData.address,
//         password: formData.password,
//       });

//       await register(
//         validated.fullName,
//         validated.email,
//         validated.address,
//         validated.password
//       );

//       setActiveTab("signin");
//       setFormData({
//         email: validated.email,
//         password: "",
//         fullName: "",
//         address: "",
//       });
//     } catch (error: any) {
//       if (error instanceof z.ZodError) {
//         const fieldErrors: Record<string, string> = {};
//         error.issues.forEach((err) => {
//           if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
//         });
//         setErrors(fieldErrors);
//       } else {
//         setApiError("Registration failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* =========================
//             UI
//   ========================= */
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="bg-[#F5F5F0] rounded-[24px] p-[48px] w-full max-w-[530px] shadow-lg">
//         {/* Logo */}
//         <div className="flex justify-center mb-4">
//           <Logo />
//         </div>

//         <p className="text-center text-[#7A7A7A] text-[16px] mb-8">
//           Premium flavors, delivered.
//         </p>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-8 bg-white rounded-[56px] p-1">
//           {["signin", "register"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => {
//                 setActiveTab(tab as any);
//                 setErrors({});
//                 setApiError("");
//               }}
//               className={`flex-1 h-[40px] rounded-[56px] text-[14px] font-medium transition ${
//                 activeTab === tab
//                   ? "bg-[#F5F5F0] text-[#1A3C34]"
//                   : "text-[#7A7A7A]"
//               }`}
//             >
//               {tab === "signin" ? "Sign in" : "Register"}
//             </button>
//           ))}
//         </div>

//         {/* API Error */}
//         {apiError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-600 text-sm">{apiError}</p>
//           </div>
//         )}

//         {/* Sign In */}
//         {activeTab === "signin" && (
//           <div className="space-y-6">
//             <Input
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleInputChange("email")}
//               type="email"
//               width="w-full"
//               height="h-[48px]"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs">{errors.email}</p>
//             )}

//             <Input
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleInputChange("password")}
//               type="password"
//               width="w-full"
//               height="h-[48px]"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs">{errors.password}</p>
//             )}

//             <Button
//               text={isLoading ? "Signing In..." : "Sign In"}
//               onClick={handleSignIn}
//               width="w-full"
//               height="h-[48px]"
//               bgColor="#1A3C34"
//               textColor="#FFFFFF"
//             />
//           </div>
//         )}

//         {/* Register */}
//         {activeTab === "register" && (
//           <div className="space-y-6">
//             <Input
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleInputChange("fullName")}
//               width="w-full"
//               height="h-[48px]"
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-xs">{errors.fullName}</p>
//             )}

//             <Input
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleInputChange("email")}
//               type="email"
//               width="w-full"
//               height="h-[48px]"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs">{errors.email}</p>
//             )}

//             <Input
//               placeholder="Address"
//               value={formData.address}
//               onChange={handleInputChange("address")}
//               width="w-full"
//               height="h-[48px]"
//             />
//             {errors.address && (
//               <p className="text-red-500 text-xs">{errors.address}</p>
//             )}

//             <Input
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleInputChange("password")}
//               type="password"
//               width="w-full"
//               height="h-[48px]"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs">{errors.password}</p>
//             )}

//             <Button
//               text={isLoading ? "Creating Account..." : "Create Account"}
//               onClick={handleRegister}
//               width="w-full"
//               height="h-[48px]"
//               bgColor="#1A3C34"
//               textColor="#FFFFFF"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
