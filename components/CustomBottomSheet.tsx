import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ReactNode } from "react";
import { View } from "react-native";

interface CustomBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  snapPoints: string[];
  children: ReactNode;
}

export const CustomBottomSheet = ({
  bottomSheetModalRef,
  snapPoints,
  children,
}: CustomBottomSheetProps) => (
  <BottomSheetModal ref={bottomSheetModalRef} snapPoints={snapPoints}>
    <View style={{ flex: 1, padding: 16 }}>{children}</View>
  </BottomSheetModal>
); 