import {View, StyleSheet, ViewStyle} from 'react-native';

type DivisorProps = {
  style?: ViewStyle;
};

const Divisor = ({style}: DivisorProps) => {
  return <View style={[styles.container, style]} />;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 1,
    backgroundColor: '#F2F4F6',
    marginVertical: 16,
  },
});
export default Divisor;
