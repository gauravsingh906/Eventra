
// App.js Updates

import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import UserAccountPage from './pages/UserAccountPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddEvent from './pages/AddEvent';
import EventPage from './pages/EventPage';
import CalendarView from './pages/CalendarView';
import OrderSummary from './pages/OrderSummary';
import PaymentSummary from './pages/PaymentSummary';
import TicketPage from './pages/TicketPage';
import CreateEvent from './pages/CreateEvent';
import PrivateRoute from './PrivateRoute';

axios.defaults.baseURL = 'https://eventra-back.onrender.com';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />

          <Route
            path='useraccount'
            element={
              <PrivateRoute>
                <UserAccountPage />
              </PrivateRoute>
            }
          />

          <Route
            path='createEvent'
            element={
              <PrivateRoute>
                <AddEvent />
              </PrivateRoute>
            }
          />

          <Route
            path='event/:id'
            element={
              <PrivateRoute>
                <EventPage />
              </PrivateRoute>
            }
          />

          <Route
            path='create'
            element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            }
          />

          <Route
            path='calendar'
            element={
              
                <CalendarView />
             
            }
          />

          <Route
            path='wallet'
            element={
              <PrivateRoute>
                <TicketPage />
              </PrivateRoute>
            }
          />

          <Route
            path='event/:id/ordersummary'
            element={
              <PrivateRoute>
                <OrderSummary />
              </PrivateRoute>
            }
          />

          <Route
            path='event/:id/ordersummary/paymentsummary'
            element={
              <PrivateRoute>
                <PaymentSummary />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path='register' element={<RegisterPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='forgotpassword' element={<ForgotPassword />} />
        <Route path='resetpassword' element={<ResetPassword />} />

        {/* Redirect for undefined routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
