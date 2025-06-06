import React, { useEffect, useState } from 'react';

function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2000); // Bắt đầu mờ dần sau s

    const removeTimer = setTimeout(() => {
      onClose();
    }, 3000); // Gọi hàm onClose sau 3s

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed top-[4rem] right-2 z-50 transition-opacity duration-500 ${
        visible ? 'opacity-100' :'opacity-0'
      }`}
    >
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;
