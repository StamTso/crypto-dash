import DashBoard from './features/DashBoard/DashBoard'
import { CryptoProvider } from './context/CryptoContext';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen h-max bg-gray-100">
      <CryptoProvider>
        <DashBoard />
      </CryptoProvider>
    </div>
  )
}

export default App
