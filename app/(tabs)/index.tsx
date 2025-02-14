import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Text,
  Button,
  Card,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useFocusEffect } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheet from "@/components/BottomSheet";
import AddTransactionSheet from "@/components/AddTransactionSheet";
import { fetchTransactions } from "@/store/transactions/transactionsThunks";
import { PieChart } from "react-native-chart-kit";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { transactions, loading } = useSelector(
    (state: RootState) => state.transactions
  );
  const [filterTime, setFilterTime] = useState<"all" | "monthly" | "weekly">(
    "all"
  );
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(fetchTransactions(user.id));
      }
    }, [dispatch, user?.id])
  );

  const getFilteredData = () => {
    const now = new Date();
    let filtered = transactions;

    if (filterTime === "weekly") {
      filtered = filtered.filter(
        (t) => new Date(t.created_at) > new Date(now.setDate(now.getDate() - 7))
      );
    } else if (filterTime === "monthly") {
      filtered = filtered.filter(
        (t) =>
          new Date(t.created_at) > new Date(now.setMonth(now.getMonth() - 1))
      );
    }

    return filtered;
  };

  const { chartData, totalIncome, totalExpenses, balance } = useMemo(() => {
    const filteredData = getFilteredData();

    const groupedByDate = filteredData.reduce((acc, transaction) => {
      const date = new Date(transaction.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[date].income += Math.abs(transaction.amount);
      } else {
        acc[date].expense += Math.abs(transaction.amount);
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const chartData = Object.entries(groupedByDate)
      .map(([date, values]) => ({
        date,
        income: values.income || 0,
        expense: values.expense || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    const totalIncome = filteredData
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = filteredData
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    return {
      chartData: chartData.length
        ? chartData
        : [{ date: new Date().toLocaleDateString(), income: 0, expense: 0 }],
      totalIncome,
      totalExpenses,
      balance,
    };
  }, [transactions, filterTime]);

  const Chart = useMemo(() => {
    const data = [
      {
        name: "Income",
        amount: Math.max(totalIncome, 0),
        color: "#4CAF50",
        legendFontColor: "#7F7F7F",
      },
      {
        name: "Expense",
        amount: Math.max(totalExpenses, 0),
        color: "#FF4444",
        legendFontColor: "#7F7F7F",
      },
    ];

    const getMessage = () => {
      const ratio = totalExpenses / totalIncome;
      if (ratio > 0.8) {
        return {
          text: "⚠️ Watch out! Your expenses are getting high.",
          color: "#FF4444",
        };
      } else if (ratio < 0.4 && totalIncome > 0) {
        return {
          text: "🎯 Great job! You're saving well.",
          color: "#4CAF50",
        };
      }
      return {
        text: "💡 Tip: Try to keep expenses below 80% of income.",
        color: "#666",
      };
    };

    const message = getMessage();

    return (
      <View style={{ height: 250, alignItems: "center" }}>
        <PieChart
          data={data}
          width={Dimensions.get("window").width - 60}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
        <Animated.View
          entering={FadeInDown.duration(800).springify()}
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: `${message.color}10`,
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: message.color,
          }}
        >
          <Text style={{ color: message.color }}>{message.text}</Text>
        </Animated.View>
      </View>
    );
  }, [totalIncome, totalExpenses]);

  const handleFilterChange = useCallback(
    (type: "all" | "monthly" | "weekly") => {
      setFilterTime(type);
    },
    []
  );

  const handleAddTransaction = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeIn}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <View>
            <Text variant="titleMedium" style={{ color: "#666" }}>
              Welcome back,
            </Text>
            <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
              {user?.user_metadata?.full_name || "User"}
            </Text>
          </View>
          <IconButton
            icon="bell-outline"
            mode="contained"
            containerColor="#f5f5f5"
            size={24}
            onPress={() => {
              /* handle notifications */
            }}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100)}
          style={{ marginBottom: 24 }}
        >
          <Card style={{ borderRadius: 16, elevation: 4 }}>
            <Card.Content style={{ padding: 20 }}>
              <Text
                variant="titleMedium"
                style={{ color: "#666", marginBottom: 8 }}
              >
                Total Balance
              </Text>
              <Text
                variant="displaySmall"
                style={{
                  color: balance >= 0 ? "#4CAF50" : "#FF4444",
                  fontWeight: "bold",
                  marginBottom: 4,
                }}
              >
                ${Math.abs(balance).toLocaleString()}
              </Text>
              <Text variant="bodyMedium" style={{ color: "#666" }}>
                {balance >= 0 ? "✨ Available to spend" : "⚠️ In deficit"}
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200)}
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Card style={{ flex: 1, borderRadius: 16 }}>
            <Card.Content style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-up-circle"
                  size={24}
                  color="#4CAF50"
                />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                  Income
                </Text>
              </View>
              <Text
                variant="titleLarge"
                style={{ color: "#4CAF50", fontWeight: "bold" }}
              >
                ${totalIncome.toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
          <Card style={{ flex: 1, borderRadius: 16 }}>
            <Card.Content style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="arrow-down-circle"
                  size={24}
                  color="#FF4444"
                />
                <Text variant="titleMedium" style={{ marginLeft: 8 }}>
                  Expenses
                </Text>
              </View>
              <Text
                variant="titleLarge"
                style={{ color: "#FF4444", fontWeight: "bold" }}
              >
                ${totalExpenses.toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300)}
          style={{ marginBottom: 24 }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 16,
              gap: 8,
            }}
          >
            {["all", "monthly", "weekly"].map((type) => (
              <Button
                key={type}
                mode={filterTime === type ? "contained" : "outlined"}
                onPress={() =>
                  handleFilterChange(type as "all" | "monthly" | "weekly")
                }
                style={{
                  borderRadius: 20,
                  flex: 1,
                }}
                labelStyle={{ fontSize: 12 }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </View>

          {loading ? (
            <View style={{ padding: 40 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <Card style={{ borderRadius: 16 }}>
              <Card.Content style={{ padding: 16 }}>
                <Text
                  variant="titleLarge"
                  style={{ marginBottom: 16, fontWeight: "bold" }}
                >
                  Cash Flow
                </Text>
                {Chart}
              </Card.Content>
            </Card>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <Button
            mode="contained"
            onPress={handleAddTransaction}
            style={{
              borderRadius: 12,
              height: 50,
              marginBottom: 50,
            }}
            contentStyle={{ height: 50 }}
            icon="plus"
          >
            Add Transaction
          </Button>
        </Animated.View>
      </ScrollView>

      <CustomBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={["60%"]}
      >
        <AddTransactionSheet
          onSuccess={() => bottomSheetModalRef.current?.dismiss()}
          onDismiss={() => bottomSheetModalRef.current?.dismiss()}
        />
      </CustomBottomSheet>
    </SafeAreaView>
  );
}
