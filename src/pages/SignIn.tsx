import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardView';

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

  const onSubmit = () => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }

    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
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
          keyboardType="number-pad"
          textContentType="password"
          importantForAccessibility="yes"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={[styles.loginButton, canGoNext && styles.loginButtonActive]}
          onPress={onSubmit}
          disabled={!canGoNext}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable
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
