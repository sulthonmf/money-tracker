import React, { useState } from "react";
import { View, SafeAreaView, Platform, StatusBar } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { signUp } from "@/store/auth/signUpThunk";
import { useDispatch } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from "@/hooks/useThemeColor";

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await dispatch(signUp({ email, password, name }) as any).unwrap();
      router.replace("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }

    setLoading(false);
  };

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
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text variant="headlineLarge" style={{ fontWeight: "bold", marginBottom: 8 }}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={{ color: "#666", textAlign: "center" }}>
            Start your journey to better finances
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
            mode="outlined"
            label="Full Name"
            value={name}
            onChangeText={setName}
            left={<TextInput.Icon icon="account" />}
            autoCapitalize="words"
            style={{ backgroundColor }}
          />

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
            style={{ backgroundColor }}
          />

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            left={<TextInput.Icon icon="lock" />}
            style={{ backgroundColor }}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleRegister}
          disabled={loading}
          loading={loading}
          style={{ 
            marginTop: 24,
            height: 48,
            justifyContent: "center"
          }}
          contentStyle={{ height: 48 }}
        >
          Create Account
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/login")}
          disabled={loading}
          style={{ marginTop: 12 }}
        >
          Already have an account? Login
        </Button>
      </View>
    </SafeAreaView>
  );
}
