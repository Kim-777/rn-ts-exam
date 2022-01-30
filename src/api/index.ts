import axios from 'axios';
import {Platform} from 'react-native';

export const getUrl = () => {
  return Platform.select({
    ios: 'http://localhost:3105',
    android: 'http://10.0.2.2:3105',
  });
};

const restApi = axios.create({
  baseURL: getUrl(),
});

export default restApi;
