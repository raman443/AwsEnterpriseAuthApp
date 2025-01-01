import {CognitoUserPool} from 'amazon-cognito-identity-js';
const poolData = {
  UserPoolId: 'eu-north-1_wGqAcTF0s',
  ClientId: '2ied3o3n0h1n1n6mqtp8o6g4tp',
};
export const cognitoPool = new CognitoUserPool(poolData);