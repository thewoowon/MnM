import {useTheme} from '@contexts/ThemeContext';
import {View, Text, Pressable} from 'react-native';

const EVALUATION_MAP = {
  disappointed: '아쉬워요',
  satisfied: '좋아요',
  neutral: '적당해요',
  excellent: '최고에요',
};

type EvaluationProgressBoxProps = {
  evaluationCount: {
    disappointed: number;
    satisfied: number;
    neutral: number;
    excellent: number;
  };
};

const EvaluationProgressBox = ({
  evaluationCount,
}: EvaluationProgressBoxProps) => {
  const {colors, scale} = useTheme();

  const totalCount =
    Object.values(evaluationCount).reduce((a, b) => a + b, 0) || 1; // Avoid division by zero
  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        paddingVertical: 15,
        paddingHorizontal: 12,
      }}>
      {Object.entries(evaluationCount).map(([key, count]) => (
        <View
          key={key}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 6,
          }}>
          <Text
            style={{
              width: 42,
              color: scale.gray.gray1,
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              lineHeight: 18,
            }}>
            {EVALUATION_MAP[key as keyof typeof EVALUATION_MAP]}
          </Text>
          <View
            style={{
              width: 140,
              height: 6,
              backgroundColor: scale.gray.gray8,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
            <View
              style={{
                width: `${(count / totalCount) * 100}%`,
                height: '100%',
                backgroundColor: colors.primary,
                borderRadius: 4,
              }}
            />
          </View>
          <Text
            style={{
              color: scale.gray.gray4,
              fontSize: 12,
              fontFamily: 'Pretendard-Regular',
              lineHeight: 18,
            }}>
            {count}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default EvaluationProgressBox;
