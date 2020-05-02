import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import baseUrl from '../utils/baseUrl';
import { parseCookies } from 'nookies';
import axios from 'axios';
import AccountPermission from "../components/Account/AccountPermissions";


function Account({user, orders }) {

  return <>
    <AccountHeader { ...user}/>
    <AccountOrders orders = {orders} />
    {user.role === 'root' && <AccountPermission currentUserId={user._id}/>}
  </>;
}



Account.getInitialProps = async ctx => {
 const { token } = parseCookies(ctx);
 if (!token) {
    return { orders: [] }
  }
  const payload = { headers: { Authorization: token}};
  const url = `${baseUrl}/api/orders`;
  const response = await axios.get(url, payload);
  return response.data;
}
export default Account;
