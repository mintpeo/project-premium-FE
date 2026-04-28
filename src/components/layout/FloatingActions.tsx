import React from 'react';
import { Link } from 'react-router-dom';

const FloatingActions = () => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 shadow-2xl">
      {/* Zalo Float */}
      <button className="w-12 h-12 bg-[#0088cc] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.572 13.916H18.96c-.347 0-.521.173-.521.521v.52c0 1.25-1.041 2.29-2.29 2.29h-.694c-1.25 0-2.29-1.04-2.29-2.29V11.14c0-1.25 1.04-2.29 2.29-2.29h.694c1.25 0 2.29 1.04 2.29 2.29v3.47h1.041c1.249 0 2.29-1.04 2.29-2.29v-1.734c0-3.33-2.707-6.037-6.036-6.037H8.927C5.597 4.549 2.89 7.256 2.89 10.585v1.735c0 3.329 2.707 6.036 6.037 6.036V21c0 .242.277.378.468.225l2.673-2.148h4.636c3.33 0 6.037-2.707 6.037-6.036v-.52c0-.348-.174-.522-.521-.522L21.572 13.916zM15.488 12.18h-4.858c-.347 0-.52-.173-.52-.52V11.14c0-.347.173-.52.52-.52h4.858c.346 0 .52.173.52.52v.52c0 .347-.174.52-.52.52z" /></svg>
      </button>
      {/* Messenger Float */}
      <button className="w-12 h-12 bg-[#0084FF] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.14 2 11.25c0 2.915 1.488 5.495 3.794 7.159V22l3.456-1.892c.87.24 1.79.37 2.748.37 5.523 0 10-4.14 10-9.227C22 6.139 17.525 2 12 2zm1.095 12.35l-2.825-3.023-5.498 3.023 6.06-6.438 2.868 3.023 5.46-3.023-6.065 6.438z" clipRule="evenodd" /></svg>
      </button>
      {/* Document search Float */}
      <button className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-orange-600/20">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </button>
      {/* Profile Float */}
      <Link to="/profile" className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-orange-600/20">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </Link>
    </div>
  );
};

export default FloatingActions;
