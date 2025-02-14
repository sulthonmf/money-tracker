import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
  

export function withAuth(Component: React.FC) {
  return function ProtectedRoute(props: any) {
    const user = useSelector((state: RootState) => state.auth.user);  
    const loading = useSelector((state: RootState) => state.auth.loading);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user && !isAuthenticated) {
        router.replace("/login");
      }
    }, [user, loading, isAuthenticated]);

    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return <Component {...props} />;
  };
}
