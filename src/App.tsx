import './App.css'
import { AuthProvider } from './hooks/AuthContext';
import RouterPages from './routes/router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {

  return (
    <AuthProvider>
      <RouterPages/>
    </AuthProvider>
  )
}

export default App
