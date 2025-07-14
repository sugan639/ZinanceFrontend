
// Admin constants for the banking application
export const LOGIN_URL = `http://localhost:8080/Banking_App/auth/login`;
export const LOGOUT_URL = 'http://localhost:8080/Banking_App/auth/logout';
export const ADMIN_PROFILE_URL = `http://localhost:8080/Banking_App/admin/profile`;
export const UPDATE_PROFILE_URL = 'http://localhost:8080/Banking_App/admin/users/update';
export const DEPOSIT_URL = `http://localhost:8080/Banking_App/admin/transactions/deposit`;
export const WITHDRAW_URL = `http://localhost:8080/Banking_App/admin/transactions/withdraw`;
export const TRANSFER_URL = `http://localhost:8080/Banking_App/admin/transactions/transfer`;
export const FIND_TRANSACTIONS_URL = 'http://localhost:8080/Banking_App/admin/transactions/query';

export const CREATE_USER_URL = 'http://localhost:8080/Banking_App/admin/users/create';
export const UPDATE_USER_URL = 'http://localhost:8080/Banking_App/admin/users/update';
export const NEW_CUSTOMER_URL = 'http://localhost:8080/Banking_App/admin/new-customer';
export const NEW_EMPLOYEE_URL = 'http://localhost:8080/Banking_App/admin/new-employee';
export const GET_USER_URL = 'http://localhost:8080/Banking_App/admin/users?user_id=';


export const GET_ACCOUNTS_URL = 'http://localhost:8080/Banking_App/admin/account/get-accounts?customer_id=';
export const UPDATE_ACCOUNT_STATUS_URL = 'http://localhost:8080/Banking_App/admin/account/update';
export const CREATE_NEW_ACCOUNT_URL = 'http://localhost:8080/Banking_App/admin/customer/new-account';


export const ANALYTICS_MONTHLY_URL = 'http://localhost:8080/Banking_App/admin/analytics/monthly-totals';
export const ANALYTICS_TOP_ACCOUNTS_URL = 'http://localhost:8080/Banking_App/admin/analytics/top-accounts';

// You can add other endpoints similarly:
// export const REGISTER_URL = `${API_BASE_URL}/auth/register`;

// Dynamic URL for admin user fetch (based on user ID)
export const getUserData = (userId: any ) =>
  `http://localhost:8080/Banking_App/admin/users?user_id=${userId}`;


// Employee constants
export const EMPLOYEE_PROFILE_URL = 'http://localhost:8080/Banking_App/employee/profile';

// /src/lib/constants.ts
export const EMP_BRANCH_SUMMARY_URL = 'http://localhost:8080/Banking_App/employee/analytics/transaction-summary';

export const EMP_TOP_CUSTOMERS_URL ='http://localhost:8080/Banking_App/employee/analytics/top-customers';
export const EMPLOYEE_UPDATE_PROFILE_URL = 'http://localhost:8080/Banking_App/employee/users/update';



















