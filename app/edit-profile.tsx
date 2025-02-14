import React, { useState, useCallback } from "react";
import { View, SafeAreaView, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import {
  Text,
  Button,
  TextInput,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { checkSession } from "@/store/auth/getSession";

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleUpdateProfile = useCallback(async () => {
    if (!fullName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      });

      if (updateError) throw updateError;

      await dispatch(checkSession());
      setShowSnackbar(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fullName, dispatch]);

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
            Edit Profile
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

        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={{ gap: 24 }}
        >
          <View>
            <Text variant="titleMedium" style={{ marginBottom: 8, color: "#666" }}>
              Personal Information
            </Text>
            <TextInput
              mode="outlined"
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              left={<TextInput.Icon icon="account" />}
              style={{ backgroundColor: "#fff" }}
              autoCapitalize="words"
            />
          </View>

          <View>
            <Text variant="titleMedium" style={{ marginBottom: 8, color: "#666" }}>
              Contact Information
            </Text>
            <TextInput
              mode="outlined"
              label="Email"
              value={user?.email}
              editable={false}
              left={<TextInput.Icon icon="email" />}
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(300)}
          style={{ 
            flex: 1, 
            justifyContent: "flex-end", 
            paddingBottom: 20 
          }}
        >
          <Button
            mode="contained"
            onPress={handleUpdateProfile}
            loading={loading}
            disabled={loading}
            contentStyle={{ height: 48 }}
            style={{ borderRadius: 12 }}
            icon="content-save"
          >
            Save Changes
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
          Profile updated successfully! 🎉
        </Snackbar>
      </View>
    </SafeAreaView>
  );
} 