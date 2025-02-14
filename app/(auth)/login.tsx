import React, { useCallback, useState } from "react";
import { View, SafeAreaView, Platform, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Text } from "react-native-paper";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "@/store/auth/signInThunk";
import { RootState } from "@/store/store";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const backgroundColor = useThemeColor({}, "background");

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      return;
    }
    try {
      await dispatch(signIn({ email, password }) as any);
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, [email, password, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 15,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center", marginVertical: 40 }}>
          <Text variant="headlineLarge" style={{ fontWeight: "bold", marginBottom: 8 }}>
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={{ color: "#666", textAlign: "center" }}>
            Sign in to continue managing your finances
          </Text>
        </View>

        {error && (
          <View style={{ 
            backgroundColor: "#FFEBEE", 
            padding: 12, 
            borderRadius: 8,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 8
          }}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#D32F2F" />
            <Text style={{ color: "#D32F2F", flex: 1 }}>{error}</Text>
          </View>
        )}

        <View style={{ gap: 16 }}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            left={<TextInput.Icon icon="lock" />}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={{ 
            marginTop: 24,
            height: 48,
            justifyContent: "center"
          }}
          contentStyle={{ height: 48 }}
        >
          Sign In
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/register")}
          style={{ marginTop: 12 }}
        >
          Don't have an account? Register
        </Button>
      </View>
    </SafeAreaView>
  );
}
