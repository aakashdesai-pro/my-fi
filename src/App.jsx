import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ColorModeContext, useColorMode } from './contexts/ThemeContext';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CreateCategory from './pages/Categories/Create';
import EditCategory from './pages/Categories/Edit';
import Accounts from './pages/Accounts';
import CreateAccount from './pages/Accounts/Create';
import EditAccount from './pages/Accounts/Edit';
import Transactions from './pages/Transactions';
import CreateTransaction from './pages/Transactions/Create';
import EditTransaction from './pages/Transactions/Edit';
import Loans from './pages/Loans';
import CreateLoan from './pages/Loans/Create';
import EditLoan from './pages/Loans/Edit';
import Incomes from './pages/Incomes';
import CreateIncome from './pages/Incomes/Create';
import EditIncome from './pages/Incomes/Edit';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [theme, colorMode] = useColorMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/create" element={<CreateCategory />} />
                <Route path="categories/edit/:id" element={<EditCategory />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="accounts/create" element={<CreateAccount />} />
                <Route path="accounts/edit/:id" element={<EditAccount />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transactions/create" element={<CreateTransaction />} />
                <Route path="transactions/edit/:id" element={<EditTransaction />} />
                <Route path="loans" element={<Loans />} />
                <Route path="loans/create" element={<CreateLoan />} />
                <Route path="loans/edit/:id" element={<EditLoan />} />
                <Route path="incomes" element={<Incomes />} />
                <Route path="incomes/create" element={<CreateIncome />} />
                <Route path="incomes/edit/:id" element={<EditIncome />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

