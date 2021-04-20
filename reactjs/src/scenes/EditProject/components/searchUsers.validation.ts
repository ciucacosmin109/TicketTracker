import { L } from '../../../lib/abpUtility';

const rules = {
  search: [
    {
      required: true, 
      message: L('ThisFieldIsRequired'),
    },
    { 
      min: 3,
      message: L('ThisFieldMustHaveAtLeast3Chr'),
    },
  ], 
};

export default rules;
