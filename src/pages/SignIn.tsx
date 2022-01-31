import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import DismissKeyboardView from '../components/DismissKeyboardView';
import {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/userSlice';
import restApi from '../api';
import EncryptedStorage from 'react-native-encrypted-storage';

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonZone: {
    alignItems: 'center',
  },
});

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: SignInScreenProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const emailRef = React.useRef<TextInput | null>(null);
  const passwordRef = React.useRef<TextInput | null>(null);

  const onChangeEmail = (text: string) => {
    setEmail(text);
  };

  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const onSubmit = async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }

    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }

    try {
      setLoading(true);
      const response = await restApi.post(`/login`, {
        email,
        password, // hash화, 일방향 암호화 //  양방향 암호화
      });
      console.log('response :-=========::: ', response);
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          accessToken: response.data.data.accessToken,
        }),
      );

      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      );
    } catch (error: any) {
      // const errorResponse = (error as AxiosError).response;
      console.warn('error :::: ', error);
      if ((error as AxiosError).response) {
        Alert.alert('알림', error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const canGoNext = !!(email && password);

  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeEmail}
          importantForAccessibility="yes"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="이메일을 입력해주세요."
          autoCapitalize="none"
          returnKeyType="next"
          ref={emailRef}
          onSubmitEditing={() => {
            if (passwordRef.current) {
              passwordRef.current.focus();
            }
          }}
          blurOnSubmit={false}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry
          onChangeText={onChangePassword}
          placeholder="비밀번호를 입력해주세요."
          autoComplete="password"
          ref={passwordRef}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          importantForAccessibility="yes"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={[styles.loginButton, canGoNext && styles.loginButtonActive]}
          onPress={onSubmit}
          disabled={!canGoNext || loading}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable
          disabled={loading}
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};

export default SignIn;
