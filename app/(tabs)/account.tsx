import React, { useCallback } from "react";
import { View, SafeAreaView, Platform, StatusBar } from "react-native";
import { withAuth } from "@/hoc/withAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signOut } from "@/store/auth/signOutThunk";
import { useRouter } from "expo-router";
import { Text, Button, Avatar, Card, List, Divider } from "react-native-paper";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AccountScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    dispatch(signOut());
  }, [dispatch]);

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 15,
        }}
      >
        <Animated.View entering={FadeIn}>
          <Text variant="headlineMedium" style={{ fontWeight: "bold", marginBottom: 24 }}>
            Profile
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100)}>
          <Card style={{ marginBottom: 24, borderRadius: 16, elevation: 4 }}>
            <Card.Content style={{ alignItems: "center", padding: 24 }}>
              <Avatar.Text
                size={88}
                label={getInitials(user?.user_metadata?.full_name || "User")}
                style={{ 
                  marginBottom: 16,
                  backgroundColor: "#2196F3",
                }}
              />
              <Text 
                variant="headlineSmall" 
                style={{ 
                  fontWeight: "bold", 
                  marginBottom: 4,
                  textAlign: "center" 
                }}
              >
                {user?.user_metadata?.full_name || "User"}
              </Text>
              <Text 
                variant="bodyLarge" 
                style={{ 
                  color: "#666",
                  textAlign: "center" 
                }}
              >
                {user?.email}
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Card style={{ borderRadius: 16, marginBottom: 24 }}>
            <Card.Content style={{ padding: 8 }}>
              <List.Item
                title="Edit Profile"
                description="Update your personal information"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="account-edit" 
                    color="#2196F3"
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push("/edit-profile")}
                style={{ borderRadius: 12 }}
              />
              <Divider style={{ marginVertical: 4 }} />
              <List.Item
                title="Change Password"
                description="Update your security settings"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="lock-outline" 
                    color="#4CAF50"
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push("/change-password")}
                style={{ borderRadius: 12 }}
              />
              <Divider style={{ marginVertical: 4 }} />
              <List.Item
                title="Help & Support"
                description="Get help and contact support"
                left={(props) => (
                  <List.Icon 
                    {...props} 
                    icon="help-circle-outline" 
                    color="#FF9800"
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => router.push("/help-support")}
                style={{ borderRadius: 12 }}
              />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300)}
          style={{ 
            flex: 1, 
            justifyContent: "flex-end", 
            paddingBottom: 50 
          }}
        >
          <Button
            mode="contained"
            onPress={handleLogout}
            icon="logout"
            contentStyle={{ height: 48 }}
            style={{ 
              borderRadius: 12,
              backgroundColor: "#FF4444",
            }}
          >
            Sign Out
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

export default withAuth(AccountScreen);
