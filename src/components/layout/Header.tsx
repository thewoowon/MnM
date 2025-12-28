import { LeftChevronIcon } from '@components/Icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type HeaderProps = {
  onPress?: () => void;
  title?: string;
  isBack?: boolean;
  rightButton?: React.ReactNode;
  rightButtonAction?: () => void;
};

const Header = ({
  onPress,
  title,
  isBack = true,
  rightButton,
  rightButtonAction,
}: HeaderProps) => {
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
          }}
        >
          <Pressable onPress={onPress}>
            <LeftChevronIcon color="#F8F5CC" />
          </Pressable>
        </View>
      )}
      <Text style={styles.headerText}>{title}</Text>
      {/* 오른쪽 공간을 차지하기 위한 빈 View */}
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
    minHeight: 50,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  headerText: {
    color: '#F8F5CC',
    fontSize: 16,
    fontFamily: 'GalmuriMono9',
  },
});

export default Header;
