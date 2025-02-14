import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Modal } from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createTransaction } from "@/store/transactions/transactionsThunks";

interface AddTransactionSheetProps {
  onSuccess?: () => void;
  onDismiss?: () => void;
}

export default function AddTransactionSheet({ onSuccess, onDismiss }: AddTransactionSheetProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('expense');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAdd = async () => {
    if (!name || !value || !user?.id) return;

    try {
      await dispatch(createTransaction({
        name,
        amount: Number(value),
        type,
        created_at: date,
        userId: user.id,
      })).unwrap();

      onSuccess?.();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleCancel = () => {
    onDismiss?.();
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={{ 
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{ 
              backgroundColor: 'white',
              padding: 16,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <Button onPress={() => setShowDatePicker(false)}>Cancel</Button>
                <Button onPress={() => setShowDatePicker(false)}>Done</Button>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(_, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            </View>
          </View>
        </Modal>
      );
    }

    return showDatePicker ? (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(_, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) setDate(selectedDate);
        }}
      />
    ) : null;
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        mode="outlined"
        label="Name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 15 }}
      />

      <TextInput
        mode="outlined"
        label="Value"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={{ marginBottom: 15 }}
      />

      <TouchableOpacity 
        onPress={() => setShowDatePicker(true)}
        style={{ marginBottom: 15 }}
      >
        <TextInput
          mode="outlined"
          label="Date"
          value={date.toLocaleDateString()}
          editable={false}
          right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
        />
      </TouchableOpacity>

      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'expense', label: 'Expense' },
          { value: 'income', label: 'Income' },
        ]}
        style={{ marginBottom: 15 }}
      />

      {renderDatePicker()}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <Button 
          mode="outlined" 
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <Button mode="contained" onPress={handleAdd}>
          Add
        </Button>
      </View>
    </View>
  );
} 