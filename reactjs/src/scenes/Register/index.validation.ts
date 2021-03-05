import { Rule } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';

const rules = { 
  name: [{ required: true, message: L('ThisFieldIsRequired') }],
  surname: [{ required: true, message: L('ThisFieldIsRequired') }],
  userName: [{ required: true, message: L('ThisFieldIsRequired') }], 
  emailAddress: [
    { required: true, message: L('ThisFieldIsRequired') },
    {
      type: 'email',
      message: L('InvalidEmailAddress')
    }
  ],
  password: [
    { required: true, message: L('ThisFieldIsRequired') },
    { 
      pattern: RegExp("(?=^.{8,}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s)[0-9a-zA-Z!@#$%^&*()]*$"), 
      message: L('PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber')
    }
  ], 
  password2: [
    { required: true, message: L('ThisFieldIsRequired') },  
    (form: any) => {
      return {
        validator: (_: Rule, value: any) => {
          if (!value || form.getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject('The two passwords that you entered do not match!');
        }
      };
    },
  ], 
 
};

export default rules;
