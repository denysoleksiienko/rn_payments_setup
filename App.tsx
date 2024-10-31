import React, {useCallback, useMemo} from 'react';
import {Button, SafeAreaView, ScrollView} from 'react-native';
import {
  IosPaymentMethodDataInterface,
  IosPKMerchantCapability,
  PaymentMethodNameEnum,
  SupportedNetworkEnum,
  PaymentRequest,
  PaymentComplete,
  AndroidAllowedAuthMethodsEnum,
  AndroidPaymentMethodDataInterface,
  EnvironmentEnum,
} from '@rnw-community/react-native-payments';

function App(): React.JSX.Element {
  const iosPaymentMethodData: IosPaymentMethodDataInterface = useMemo(
    () => ({
      supportedMethods: PaymentMethodNameEnum.ApplePay,
      data: {
        countryCode: 'UA',
        currencyCode: 'UAH',
        merchantIdentifier: 'merchant.test',
        merchantCapabilities: [IosPKMerchantCapability.PKMerchantCapability3DS],
        supportedNetworks: [
          SupportedNetworkEnum.Visa,
          SupportedNetworkEnum.Mastercard,
        ],
      },
    }),
    [],
  );

  const androidPaymentMethodData: AndroidPaymentMethodDataInterface = useMemo(
    () => ({
      supportedMethods: PaymentMethodNameEnum.AndroidPay,
      data: {
        environment: __DEV__
          ? EnvironmentEnum.TEST
          : EnvironmentEnum.PRODUCTION,
        currencyCode: 'UAH',
        countryCode: 'UA',
        supportedNetworks: [
          SupportedNetworkEnum.Visa,
          SupportedNetworkEnum.Mastercard,
        ],
        allowedAuthMethods: [
          AndroidAllowedAuthMethodsEnum.PAN_ONLY,
          AndroidAllowedAuthMethodsEnum.CRYPTOGRAM_3DS,
        ],
        gatewayConfig: {
          gateway: '',
          gatewayMerchantId: '',
        },
      },
    }),
    [],
  );

  const paymentDetails = useMemo(
    () => ({
      total: {
        amount: {
          currency: 'UAH',
          value: '100',
        },
        label: 'LABEL',
      },
    }),
    [],
  );

  const paymentRequest = useMemo(
    () =>
      new PaymentRequest(
        [iosPaymentMethodData, androidPaymentMethodData],
        paymentDetails,
      ),
    [androidPaymentMethodData, iosPaymentMethodData, paymentDetails],
  );

  const handlePay = useCallback(async () => {
    try {
      const isPaymentPossible = await paymentRequest.canMakePayment();
      if (isPaymentPossible) {
        const paymentResponse = await paymentRequest.show();

        console.log(paymentResponse);

        await paymentResponse.complete(PaymentComplete.SUCCESS);
      }
    } catch (err) {
      console.error('Payment process error:', err);
    }
  }, [paymentRequest]);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Button title="Open Payment" onPress={handlePay} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
