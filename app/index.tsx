import LoginButtons from '@/components/auth/LoginButtons';
import { Text } from '@/components/Themed';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const Page = () => {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.icon} />
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white', textAlign: 'center', paddingTop: 20 }}>
        DeeperSeeker
      </Text>
      <LoginButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 100,
  },
});

export default Page;
