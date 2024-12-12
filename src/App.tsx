import DashBoard from './features/DashBoard/DashBoard'
import { CryptoProvider } from './context/CryptoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen h-max bg-gray-100">
      <CryptoProvider>
        <ToastContainer />
        <DashBoard />
      </CryptoProvider>
    </div>
  )
}

export default App
