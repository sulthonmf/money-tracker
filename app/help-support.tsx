import React from "react";
import { View, SafeAreaView, Platform, StatusBar, Linking } from "react-native";
import { Text, List, Divider, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

export default function HelpSupportScreen() {
  const router = useRouter();
  const supportEmail = "sulthonmf@gmail.com";
  const websiteUrl = "https://dev-sulthon.vercel.app";

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${supportEmail}`);
  };

  const handleWebsitePress = () => {
    Linking.openURL(websiteUrl);
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <IconButton 
            icon="arrow-left" 
            onPress={() => router.back()} 
          />
          <Text variant="headlineMedium">Help & Support</Text>
        </View>

        <List.Section>
          <List.Item
            title="Email Support"
            description={supportEmail}
            left={(props) => <List.Icon {...props} icon="email" />}
            onPress={handleEmailPress}
          />
          <Divider />
          <List.Item
            title="Visit Website"
            description={websiteUrl}
            left={(props) => <List.Icon {...props} icon="web" />}
            onPress={handleWebsitePress}
          />
        </List.Section>

        <Text
          style={{
            position: "absolute",
            bottom: 40,
            alignSelf: "center",
            color: "#666",
          }}
        >
          App Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
