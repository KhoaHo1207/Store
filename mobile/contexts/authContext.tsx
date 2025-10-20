// import { createContext, useContext, useEffect } from "react";
// import { useRouter } from "expo-router";
// import { useUserStore } from "@/stores/authStore";

// interface AuthContextProps {
//   token: string | null;
//   loading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   signup: (
//     email: string,
//     fullName: string,
//     password: string
//   ) => Promise<boolean>;
//   logout: () => Promise<void>;
//   fetchCurrentUser: () => Promise<void>;
// }

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const router = useRouter();

//   const { token, loading, error, login, signup, logout, fetchCurrentUser } =
//     useUserStore();

//   useEffect(() => {
//     if (token) {
//       router.replace("/(main)");
//     } else {
//       router.replace("/(auth)/login");
//     }
//   }, [token]);

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         loading,
//         error,
//         login,
//         signup,
//         logout,
//         fetchCurrentUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
