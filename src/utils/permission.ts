// import {
//   requestPermission,
//   getToken,
//   onTokenRefresh,
//   AuthorizationStatus,
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// import {Platform, PermissionsAndroid} from 'react-native';

// export async function requestNotificationPermission(
//   messaging: FirebaseMessagingTypes.Module,
// ) {
//   if (Platform.OS === 'ios') {
//     const status = await requestPermission(messaging);
//     const enabled =
//       status === AuthorizationStatus.AUTHORIZED ||
//       status === AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       console.log('iOS 알림 권한 허용됨');
//     } else {
//       console.log('iOS 알림 권한 거부됨');
//     }
//   } else if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//     );

//     console.log(
//       granted === PermissionsAndroid.RESULTS.GRANTED
//         ? 'Android 알림 권한 허용됨'
//         : 'Android 알림 권한 거부됨',
//     );
//   }
// }
