import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Subtle Background Graphics */}
      <div className="absolute top-[20%] left-[15%] w-48 h-48 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-60 h-60 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col pt-20 pb-40 relative z-10 px-[10%]">
        <div className="max-w-[900px]">
          <p className="text-[#0f172a] text-[15px] mb-6">
            Quên mật khẩu? Vui lòng nhập tên đăng nhập hoặc địa chỉ email. Bạn sẽ nhận được một liên kết tạo mật khẩu mới qua email.
          </p>

          <label className="block text-[#0f172a] font-bold text-[15.5px] mb-2">
            Tên đăng nhập hoặc email <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className="w-full md:w-[60%] border border-gray-200 rounded p-[12px] text-[15px] focus:outline-none focus:border-orange-500 shadow-sm bg-white block mb-6" 
          />

          <button className="bg-[#e05424] hover:bg-[#c2461c] text-white font-bold py-[12px] px-8 rounded shadow-sm text-sm uppercase tracking-wide">
            ĐẶT LẠI MẬT KHẨU
          </button>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default ResetPassword;
