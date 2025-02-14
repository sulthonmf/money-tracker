import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  StatusBar,
  Platform,
  SafeAreaView,
  Share,
  ScrollView,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  IconButton,
  Searchbar,
  Button,
  ActivityIndicator,
  Portal,
  Dialog,
  Card,
  Text,
} from "react-native-paper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheet from "@/components/BottomSheet";
import AddTransactionSheet from "@/components/AddTransactionSheet";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTransactions } from "@/store/transactions/transactionsThunks";
import generatePDF from "@/utils/generatePDF";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  type: string;
  name: string;
  user_id: string;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Transaction>);

const TransactionsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { transactions, loading } = useSelector(
    (state: RootState) => state.transactions
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloadPeriod, setDownloadPeriod] = useState<"all" | "1month" | "2month">("all");
  const now = new Date();
  const twoMonthsAgo = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(fetchTransactions(user.id));
      }
    }, [dispatch, user?.id])
  );

  const handleFilter = useCallback(
    (type: "All" | "Expense" | "Income") => {
      setFilter(type);
      if (type === "All") {
        setFilteredTransactions(transactions);
      } else {
        const lowercaseType = type.toLowerCase();
        setFilteredTransactions(
          transactions.filter((tx) => tx.type.toLowerCase() === lowercaseType)
        );
      }
    },
    [transactions]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filtered = transactions.filter((tx) =>
        tx.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTransactions(filtered);
    },
    [transactions]
  );

  const handleAddTransaction = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDownload = async () => {
    try {
      let filteredData = [...transactions];
      const now = new Date();

      if (downloadPeriod === "1month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredData = transactions.filter(
          (t) => new Date(t.created_at) > oneMonthAgo
        );
      } else if (downloadPeriod === "2month") {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        filteredData = transactions.filter(
          (t) => new Date(t.created_at) > twoMonthsAgo
        );
      }

      const uri = await generatePDF(filteredData);
      await Share.share({
        url: uri,
        message: "Your transaction statement is ready",
      });
      setShowDownloadDialog(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
        <Animated.View 
          entering={FadeIn}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text variant="headlineMedium" style={{ fontWeight: "bold" }}>
            Transactions
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <IconButton
              icon="download"
              mode="contained"
              containerColor="#f5f5f5"
              onPress={() => setShowDownloadDialog(true)}
            />
            <IconButton
              icon="plus"
              mode="contained"
              onPress={handleAddTransaction}
            />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={{ marginBottom: 16 }}
        >
          <Searchbar
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ 
              borderRadius: 12,
              backgroundColor: "#f5f5f5",
              elevation: 0,
            }}
            inputStyle={{ fontSize: 16 }}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={{ marginBottom: 16 }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["All", "Expense", "Income"].map((type) => (
              <Button
                key={type}
                mode={filter === type ? "contained" : "outlined"}
                onPress={() => handleFilter(type as "All" | "Expense" | "Income")}
                style={{ 
                  flex: 1,
                  borderRadius: 20,
                }}
                labelStyle={{ fontSize: 13 }}
              >
                {type}
              </Button>
            ))}
          </View>
        </Animated.View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <MaterialCommunityIcons 
              name="file-search-outline" 
              size={64} 
              color="#666"
              style={{ marginBottom: 16 }}
            />
            <Text variant="titleMedium" style={{ color: "#666" }}>
              No transactions found
            </Text>
          </View>
        ) : (
          <AnimatedFlatList
            entering={FadeInDown.delay(300)}
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item, index }: { item: Transaction; index: number }) => (
              <Animated.View 
                entering={FadeInDown.delay(index * 100)}
              >
                <Card
                  style={{
                    marginBottom: 12,
                    borderRadius: 16,
                    elevation: 2,
                  }}
                >
                  <Card.Content style={{ padding: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: item.type === "income" ? "#E8F5E9" : "#FFEBEE",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name={item.type === "income" ? "arrow-up" : "arrow-down"}
                          size={24}
                          color={item.type === "income" ? "#4CAF50" : "#FF4444"}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text variant="titleMedium" style={{ fontWeight: "bold", marginBottom: 4 }}>
                          {item.name}
                        </Text>
                        <Text variant="bodyMedium" style={{ color: "#666" }}>
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                      </View>
                      <Text
                        variant="titleMedium"
                        style={{
                          fontWeight: "bold",
                          color: item.type === "income" ? "#4CAF50" : "#FF4444",
                        }}
                      >
                        {item.type === "income" ? "+" : "-"}${Math.abs(item.amount).toLocaleString()}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </Animated.View>
            )}
          />
        )}

        <Portal>
          <Dialog
            visible={showDownloadDialog}
            onDismiss={() => setShowDownloadDialog(false)}
            style={{ borderRadius: 16 }}
          >
            <Dialog.Title>Download Statement</Dialog.Title>
            <Dialog.Content>
              <View style={{ gap: 12 }}>
                {["all", "1month", "2month"].map((period) => (
                  <Button
                    key={period}
                    mode={downloadPeriod === period ? "contained" : "outlined"}
                    onPress={() => setDownloadPeriod(period as typeof downloadPeriod)}
                    style={{ borderRadius: 8 }}
                  >
                    {period === "all" 
                      ? "All Time" 
                      : period === "1month" 
                        ? "Last Month" 
                        : "Last 2 Months"
                    }
                  </Button>
                ))}
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDownloadDialog(false)}>Cancel</Button>
              <Button mode="contained" onPress={handleDownload}>
                Download
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <CustomBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          snapPoints={["60%"]}
        >
          <AddTransactionSheet
            onSuccess={() => bottomSheetModalRef.current?.dismiss()}
            onDismiss={() => bottomSheetModalRef.current?.dismiss()}
          />
        </CustomBottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default TransactionsScreen;
