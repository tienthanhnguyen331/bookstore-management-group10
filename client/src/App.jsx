import {Routes, Route} from 'react-router-dom';
import Header from './components/Header.jsx';
import BookPage from './pages/BookPage.jsx';


const ComingSoon = ({title}) => (
  <div className = "text-center py-20 text-2xl text-gray-400">
   Tính năng <b>{title}</b> đang được phát triển...
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Routes>
        <Route path="/" element={<ComingSoon title="Dashboard" />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/inventory" element={<ComingSoon title="Kho hàng" />} />
        <Route path="/finance" element={<ComingSoon title="Tài chính" />} />
        <Route path="/customers" element={<ComingSoon title="Khách hàng" />} />
        <Route path="/reports" element={<ComingSoon title="Báo cáo" />} />
        <Route path="/settings" element={<ComingSoon title="Cài đặt" />} />
      </Routes>
      </main>
    </div>
  );
}

export default App
