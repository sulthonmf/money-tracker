import React, { useState, useCallback } from "react";
import { View, SafeAreaView, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import {
  Text,
  Button,
  TextInput,
  HelperText,
  Snackbar,
  IconButton,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        setError("Current password is incorrect");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setShowSnackbar(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword, user?.email]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 15,
        }}
      >
        <Animated.View 
          entering={FadeIn}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <IconButton
            icon="arrow-left"
            mode="contained"
            containerColor="#f5f5f5"
            onPress={() => router.back()}
            style={{ marginRight: 16 }}
          />
          <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
            Change Password
          </Text>
        </Animated.View>

        {error && (
          <Animated.View 
            entering={FadeInDown.delay(100)}
            style={{ 
              backgroundColor: "#FFEBEE",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8
            }}
          >
            <MaterialCommunityIcons name="alert-circle" size={24} color="#D32F2F" />
            <Text style={{ color: "#D32F2F", flex: 1 }}>{error}</Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(200)} style={{ gap: 16 }}>
          <TextInput
            mode="outlined"
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            right={
              <TextInput.Icon
                icon={showCurrentPassword ? "eye-off" : "eye"}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
            left={<TextInput.Icon icon="lock" />}
            style={{ backgroundColor: "#fff" }}
          />

          <TextInput
            mode="outlined"
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            right={
              <TextInput.Icon
                icon={showNewPassword ? "eye-off" : "eye"}
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            }
            left={<TextInput.Icon icon="lock-plus" />}
            style={{ backgroundColor: "#fff" }}
          />

          <TextInput
            mode="outlined"
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            left={<TextInput.Icon icon="lock-check" />}
            style={{ backgroundColor: "#fff" }}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300)}
          style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 20 }}
        >
          <Button
            mode="contained"
            onPress={handleUpdatePassword}
            loading={loading}
            disabled={loading}
            contentStyle={{ height: 48 }}
            style={{ borderRadius: 12 }}
          >
            Update Password
          </Button>
        </Animated.View>

        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
          style={{ borderRadius: 8 }}
          action={{
            label: "Close",
            onPress: () => setShowSnackbar(false),
          }}
        >
          Password updated successfully! 🎉
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}
