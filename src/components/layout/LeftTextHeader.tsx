import { LeftChevronIcon } from '@components/Icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type LeftTextHeaderProps = {
  onPress?: () => void;
  title?: string;
  isBack?: boolean;
  rightButton?: React.ReactNode;
  rightButtonAction?: () => void;
};

const LeftTextHeader = ({
  onPress,
  title,
  isBack = true,
  rightButton,
  rightButtonAction,
}: LeftTextHeaderProps) => {
  return (
    <View style={styles.header}>
      {/* 상단 헤더 */}
      {isBack && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            left: 16,
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Pressable onPress={onPress}>
            <LeftChevronIcon color="#F8F5CC" />
          </Pressable>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          right: 16,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {rightButton && (
          <Pressable onPress={rightButtonAction}>{rightButton}</Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    maxHeight: 50,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  headerText: {
    color: '#F8F5CC',
    fontSize: 14,
    fontFamily: 'GalmuriMono9',
    lineHeight: 22,
    letterSpacing: -0.01,
  },
});

export default LeftTextHeader;
