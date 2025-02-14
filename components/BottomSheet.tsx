import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import { BottomSheetModal, BottomSheetBackdropProps, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  showHandle?: boolean;
  enablePanDownToClose?: boolean;
  enableDynamicSizing?: boolean;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

export default function CustomBottomSheet({
  children,
  snapPoints = ['50%', '75%'],
  showHandle = true,
  enablePanDownToClose = true,
  enableDynamicSizing = false,
  bottomSheetModalRef,
}: BottomSheetProps) {
  const router = useRouter();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleIndicatorStyle={!showHandle ? { display: 'none' } : undefined}
          enablePanDownToClose={enablePanDownToClose}
          enableDynamicSizing={enableDynamicSizing}
          backdropComponent={renderBackdrop}
          onDismiss={() => router.back()}
          style={styles.bottomSheet}
        >
          <View style={styles.contentContainer}>{children}</View>
        </BottomSheetModal>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
}); 