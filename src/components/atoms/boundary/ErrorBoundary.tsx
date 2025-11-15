// components/common/ErrorBoundary.tsx
import React from 'react';
import {View, Text} from 'react-native';

export class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {hasError: boolean}
> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>문제가 발생했습니다. 다시 시도해주세요.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
