import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import React from 'react';
import { useWarmUpBrowser } from './useWarmUpBrowser';


export function useAppleAuth() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  const signInWithApple = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('auth-redirect', {
          scheme: 'deeperseeker',
        }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        // Don't reload the app or navigate away
        // The useEffect in sign-in.tsx will handle the UI update
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', JSON.stringify(err));
    }
  }, [startOAuthFlow]);

  return { signInWithApple };
}
