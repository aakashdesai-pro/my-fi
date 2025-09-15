import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CreateCategory from './pages/Categories/Create';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Loans from './pages/Loans';
import Incomes from './pages/Incomes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="loans" element={<Loans />} />
            <Route path="incomes" element={<Incomes />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

