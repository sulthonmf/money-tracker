import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/BottomSheet';
import AddTransactionSheet from '@/components/AddTransactionSheet';

export default function AddTransactionModal() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomSheetModalRef.current?.present();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CustomBottomSheet 
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={['90%']}
      >
        <AddTransactionSheet />
      </CustomBottomSheet>
    </View>
  );
}
