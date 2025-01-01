import 'react-native-get-random-values';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Auth } from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import awsconfig from './aws-exports';
import 'react-native-url-polyfill/auto'; // For URL polyfill
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import {cognitoPool} from './cognito-pool';

global.Buffer = Buffer;
global.process = {
  ...global.process,
  browser: true,
};
global.crypto = require('crypto-browserify');

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [errorMessage, setErrorMessage] = useState(''); // Track error messages
  Amplify.configure(awsconfig);

  // const onPressLogin = () => {
  //   console.log("email",email);
  //   console.log("password",password);
  //   const user = new CognitoUser({
  //     Username: email,
  //     Pool: cognitoPool,
  //   });
  //   // setUser(user);
  //   const authDetails = new AuthenticationDetails({
  //     Username: email,
  //     Password: password,
  //   });
  //   user.authenticateUser(authDetails, {
  //     onSuccess: async res => {
  //       const token = res?.refreshToken?.token;
  //       await AsyncStorage.setItem('REFRESH_TOKEN', token);
        
  //       setTimeout(() => {
  //         navigation.navigate('main');
  //       }, 350);
  //     },
  //     onFailure: err => {
  //       switch (err.name) {
  //         case 'UserNotConfirmedException':
  //           return Alert.alert(General.Error, Auth.UserNotConfirmed);
  //         case 'NotAuthorizedException':
  //           return Alert.alert(General.Error, Auth.IncorrectCredentials);
  //         default:
  //           return Alert.alert(General.Error, General.SomethingWentWrong);
  //       }
  //     },
  //   });
  // };
  const onPressLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await Auth.signIn(email, password);
      console.log('Sign-in successful:', user);
      // Navigate to the next screen after successful login
    } catch (error) {
      console.log('Error signing in:', error);
      setErrorMessage(error.message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };
  const signIn = async () => {
    if (loading) return; // Prevent multiple requests
    setLoading(true); // Start loading
    setErrorMessage(''); // Clear previous errors

    try {
      // await Auth.signIn(email, password);
      console.log('Sign-in successful');
      // Navigate to the next screen or fetch additional data
      await Auth.signInWithPassword(email, password)
    } catch (error) {
      console.log('Error signing in:', error);
      setErrorMessage(error.message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enterprise Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}    // Disables auto-suggestions
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Sign In" onPress={onPressLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
