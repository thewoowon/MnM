import {Text, TextStyle} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';

const BaseText = ({
  children,
  variant = 'body',
  style,
}: {
  children: React.ReactNode;
  variant?: 'title' | 'body' | 'caption';
  style?: TextStyle;
}) => {
  const {fontSize, colors} = useTheme();
  const fontMap = {
    title: {fontSize: fontSize.lg, fontWeight: 'bold'},
    body: {fontSize: fontSize.md},
    caption: {fontSize: fontSize.sm, color: colors.text + '99'},
  };
  return <Text style={[fontMap[variant], style]}>{children}</Text>;
};

export default BaseText;
