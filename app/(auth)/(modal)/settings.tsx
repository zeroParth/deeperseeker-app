import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { googleKeyStorage, keyStorage } from '@/utils/Storage';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

const Page = () => {
  const [deepseekKey, setDeepseekKey] = useMMKVString('apikey', keyStorage);
  const [googleKey, setGoogleKey] = useMMKVString('apikey', googleKeyStorage);
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const router = useRouter();

  const { signOut } = useAuth();

  const saveApiKeys = async () => {
    if (deepseekApiKey) setDeepseekKey(deepseekApiKey);
    if (googleApiKey) setGoogleKey(googleApiKey);
    router.navigate('/(auth)/(drawer)');
  };

  const removeApiKeys = async () => {
    setDeepseekKey('');
    setGoogleKey('');
  };

  return (
    <View style={styles.container}>
      {((deepseekKey && deepseekKey !== '') || (googleKey && googleKey !== '')) && (
        <>
          <Text style={styles.label}>You are all set!</Text>
          <TouchableOpacity style={[defaultStyles.btn, { backgroundColor: Colors.primary }]} onPress={removeApiKeys}>
            <Text style={styles.buttonText}>Remove API Keys</Text>
          </TouchableOpacity>
        </>
      )}

      {(!deepseekKey || deepseekKey === '' || !googleKey || googleKey === '') && (
        <>
          <Text style={styles.label}>API Keys & Organization:</Text>

          <Text style={styles.sublabel}>DeepSeek API Key:</Text>
          <TextInput
            style={styles.input}
            value={deepseekApiKey}
            onChangeText={setDeepseekApiKey}
            placeholder="Enter your DeepSeek API key"
            autoCorrect={false}
            autoCapitalize="none"
          />

          <Text style={styles.sublabel}>Google API Key:</Text>
          <TextInput
            style={styles.input}
            value={googleApiKey}
            onChangeText={setGoogleApiKey}
            placeholder="Enter your Google API key"
            autoCorrect={false}
            autoCapitalize="none"
          />

          <TouchableOpacity style={[defaultStyles.btn, { backgroundColor: Colors.primary }]} onPress={saveApiKeys}>
            <Text style={styles.buttonText}>Save API Keys</Text>
          </TouchableOpacity>
        </>
      )}
      <Button title="Sign Out" onPress={() => signOut()} color={Colors.grey} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  sublabel: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.grey,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Page;
