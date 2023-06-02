// App.jsx
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

/*
  1. Create the config
*/
const toastConfig = {
  /*
    Modification of success toast
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: "#63f542"}}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  /*
    Modification of error toast
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),

  info: (props) => (
    <InfoToast
      {...props}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
};

export default toastConfig;
