import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import orderSlice, {Order} from '../slices/orderSlice';
import {useAppDispatch} from '../store';
import restApi from '../api';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import EncryptedStorage from 'react-native-encrypted-storage';

const EachOrder = ({item}: {item: Order}) => {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const dispatch = useAppDispatch();
  const {accessToken} = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = React.useState<boolean | null>(null);
  const [detail, setDetail] = React.useState(false);

  const toggleDetail = React.useCallback(() => {
    setDetail(prev => !prev);
  }, []);

  const onAccept = React.useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      await restApi.post(
        '/accept',
        {orderId: item.orderId},
        {headers: {authorization: `Bearer ${accessToken}`}},
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      navigation.navigate('Delivery');
    } catch (error: any) {
      console.warn('error : ', error);
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert(error.response.data.message);
          dispatch(orderSlice.actions.rejectOrder(item.orderId));
        }
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, item.orderId, accessToken, loading, navigation]);
  const onReject = React.useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item.orderId]);

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Text>
        <Text>삼성동</Text>
        <Text>왕십리동</Text>
      </Pressable>
      {detail && (
        <View>
          <View>
            <Text>네이버맵이 들어갈 장소</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={onAccept}
              disabled={loading}
              style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              onPress={onReject}
              disabled={loading}
              style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default EachOrder;

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachInfo: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
