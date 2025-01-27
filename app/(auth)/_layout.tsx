import Colors from '@/constants/Colors';
import { migrateDbIfNeeded } from '@/utils/Database';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { TouchableOpacity } from 'react-native';

const Layout = () => {
  const router = useRouter();

  return (
    <SQLiteProvider databaseName="chat.db" onInit={migrateDbIfNeeded}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors.selected },
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/settings"
          options={{
            headerTitle: 'Settings',
            presentation: 'modal',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.selected },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(drawer)');
                  }
                }}
                style={{ backgroundColor: Colors.greyLight, borderRadius: 20, padding: 4 }}
              >
                <Ionicons name="close-outline" size={16} color={Colors.grey} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
};

export default Layout;
