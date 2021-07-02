import { L } from '../../lib/abpUtility';

const rules = {
  userNameOrEmailAddress: [
    {
      required: true,
      message: L('ThisFieldIsRequired'),
    },
  ],
  captcha: [{ required: true, message: L('ProveYouAreHuman') }],
  password: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
